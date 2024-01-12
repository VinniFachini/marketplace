import { Response, NextFunction } from 'express';
import { queryAsync } from '../db';
import { CustomRequest } from '../types/user';
import { UserRole } from '../types/user';  // Importing UserRole enum

export const authorize = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(403).json({ error: 'Token inválido ou não fornecido' }); // Return to exit the function
            return
        }

        // Query the database to get user permissions
        const userPermissions = await queryAsync('SELECT role FROM users WHERE id = ?', [userId]);

        if (userPermissions.length === 0) {
            res.status(403).json({ error: 'Usuário não encontrado' }); // Return to exit the function
            return
        }

        // Check if the user has the required permission ('Admin' role)
        if (userPermissions[0].role !== UserRole.Admin) {
            res.status(403).json({ error: 'Acesso não autorizado' }); // Return to exit the function
            return
        }

        // If all checks pass, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};
