import { Request } from 'express';
// User Interface
interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    role: UserRole;
    user_image?: string;
}

// User Role Enum
enum UserRole {
    Admin = 'Admin',
    // Add other roles as necessary
}

// Authentication Interfaces

// Payload for JWT
interface JwtPayload {
    username: string;
    id: string;
}

interface CustomRequest extends Request {
    user?: JwtPayload;
    userId?: string;
}

export { User, UserRole, JwtPayload, CustomRequest };
