import { ResultSetHeader, RowDataPacket } from 'mysql2';
import db from '../../config/db';
import { AppError } from '../../utils/AppError';

export const TASK_STATUSES = ['backlog', 'in_progress', 'pending', 'done'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task extends RowDataPacket {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: Date;
  updated_at: Date;
}

function assertStatus(status: unknown): asserts status is TaskStatus {
  if (!TASK_STATUSES.includes(status as TaskStatus)) {
    throw new AppError(400, `status must be one of: ${TASK_STATUSES.join(', ')}`);
  }
}

export class TaskService {
  private async findOwned(id: number | string, userId: number): Promise<Task> {
    const [rows] = await db.query<Task[]>('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    if (!rows[0]) throw new AppError(404, 'Task not found');
    return rows[0];
  }

  async create(
    userId: number,
    input: { title?: string; description?: string | null; status?: string }
  ): Promise<Task> {
    const title = input.title === undefined ? '' : String(input.title).trim();
    if (!title) throw new AppError(400, 'title is required');
    const status = input.status ?? 'backlog';
    assertStatus(status);

    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
      [userId, title, input.description ?? null, status]
    );
    return this.findOwned(result.insertId, userId);
  }

  async list(userId: number, status?: string): Promise<Task[]> {
    let sql = 'SELECT * FROM tasks WHERE user_id = ?';
    const params: (string | number)[] = [userId];
    if (status) {
      if (!TASK_STATUSES.includes(status as TaskStatus)) throw new AppError(400, 'Invalid status filter');
      sql += ' AND status = ?';
      params.push(status);
    }
    const [rows] = await db.query<Task[]>(sql + ' ORDER BY created_at DESC', params);
    return rows;
  }

  get(userId: number, id: string): Promise<Task> {
    return this.findOwned(id, userId);
  }

  async update(
    userId: number,
    id: string,
    input: { title?: string; description?: string | null }
  ): Promise<Task> {
    const task = await this.findOwned(id, userId);
    const title = input.title !== undefined ? String(input.title).trim() : task.title;
    const description = input.description !== undefined ? input.description : task.description;
    if (!title) throw new AppError(400, 'title cannot be empty');
    await db.query('UPDATE tasks SET title = ?, description = ? WHERE id = ?', [title, description, task.id]);
    return this.findOwned(task.id, userId);
  }

  async updateStatus(userId: number, id: string, status: unknown): Promise<Task> {
    assertStatus(status);
    const task = await this.findOwned(id, userId);
    await db.query('UPDATE tasks SET status = ? WHERE id = ?', [status, task.id]);
    return this.findOwned(task.id, userId);
  }

  async remove(userId: number, id: string): Promise<void> {
    const [result] = await db.query<ResultSetHeader>('DELETE FROM tasks WHERE id = ? AND user_id = ?', [
      id,
      userId,
    ]);
    if (!result.affectedRows) throw new AppError(404, 'Task not found');
  }
}

export const taskService = new TaskService();
