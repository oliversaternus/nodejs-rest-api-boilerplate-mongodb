import { UserRole } from './UserRole';

export interface UserContext {
    id: string;
    role: UserRole;
}