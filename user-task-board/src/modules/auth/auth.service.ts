import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import db from '../../config/db';
import { AppError } from '../../utils/AppError';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface PublicUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthResult {
  user: PublicUser;
  token: string;
}

interface UserRow extends RowDataPacket, PublicUser {
  password_hash: string;
}

function signToken(user: PublicUser): string {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as SignOptions['expiresIn'],
  });
}

export class AuthService {
  async register(input: { name?: string; email?: string; password?: string }): Promise<AuthResult> {
    const { name, email, password } = input;
    if (!name || !email || !password) {
      throw new AppError(400, 'name, email and password are required');
    }
    if (!EMAIL_RE.test(email)) throw new AppError(400, 'Invalid email');
    if (password.length < 8) throw new AppError(400, 'Password must be at least 8 characters');

    const normalized = email.toLowerCase();
    const [existing] = await db.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [normalized]);
    if (existing.length) throw new AppError(409, 'Email already registered');

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, normalized, hash]
    );
    const user: PublicUser = { id: result.insertId, name, email: normalized };
    return { user, token: signToken(user) };
  }

  async login(input: { email?: string; password?: string }): Promise<AuthResult> {
    const { email, password } = input;
    if (!email || !password) throw new AppError(400, 'email and password are required');

    const [rows] = await db.query<UserRow[]>(
      'SELECT id, name, email, password_hash FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    const row = rows[0];
    if (!row || !(await bcrypt.compare(password, row.password_hash))) {
      throw new AppError(401, 'Invalid credentials');
    }
    const user: PublicUser = { id: row.id, name: row.name, email: row.email };
    return { user, token: signToken(user) };
  }
}

export const authService = new AuthService();
