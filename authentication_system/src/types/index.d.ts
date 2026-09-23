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

export interface LoginResponse extends GenericResponse {
    user: Omit<User, 'password'>;
    token: string;
}