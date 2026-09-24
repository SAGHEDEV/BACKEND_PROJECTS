export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    createdAt: Date;
}

interface GenericResponse {
    message: string;
    success: boolean;
}

export interface RegisterUserResponse extends GenericResponse {
    data: {
        user: Omit<User, 'password'>
    }
}

export interface LoginResponse extends GenericResponse {
    data: {
        user: Omit<User, 'password'>;
        token: string;
        refresh_token: string;
    }
}

export interface RefreshToken {
    id: number;
    user_id: number;
    token: string;
    expires_at: Date;
    created_at: Date;
    revoked_at: Date;
}