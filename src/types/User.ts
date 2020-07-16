import { UserRole } from './UserRole';

export interface User {
    _id?: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
}