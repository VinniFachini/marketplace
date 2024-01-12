import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/user';

dotenv.config();

interface DecodedToken {
    id: string;
    // Add other properties from your token payload here
}
export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization;

    if (!token) {
        res.status(403).json({ error: 'Token não fornecido' });
        return;
    }

    jwt.verify(token as string, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
        if (err) {
            res.status(401).json({ error: 'Falha ao autenticar token' });
            return;
        }
        req.user = decoded;  // Now TypeScript knows that 'user' is a valid property on req
        next();
    });
};

export const getUserIdFromToken = (token: string): string | null => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        const userId = decodedToken.id;
        return userId;
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        return null;
    }
};

export const getUserIdMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization;

    try {
        if (token) {
            const decodedToken = jwt.verify(token as string, process.env.JWT_SECRET as string) as { id: string }; // Assuming your decoded token has an 'id' field
            if (decodedToken) {
                req.userId = decodedToken.id;  // Now TypeScript knows that 'userId' is a valid property on req
            }
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};