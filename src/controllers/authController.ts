import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { queryAsync } from '../db';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, AuthErrorResponse, UserData } from '../types/auth';

/**
 * Controller function for user registration.
 */
export const register = async (req: Request<{}, {}, RegisterRequest>, res: Response<RegisterResponse | AuthErrorResponse>) => {
  try {
    const { name, email, password, username, imagePath } = req.body;

    const userExists = await queryAsync('SELECT * FROM users WHERE username = ?', [username]);
    const emailExists = await queryAsync('SELECT * FROM users WHERE email = ?', [email]);

    if (userExists.length > 0) {
      return res.status(400).json({ error: 'Nome de usuário já em uso' });
    }

    if (emailExists.length > 0) {
      return res.status(400).json({ error: 'E-mail já em uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await queryAsync('INSERT INTO users (name, email, password, username, user_image) VALUES (?, ?, ?, ?, ?)', [name, email, hashedPassword, username, imagePath]);

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

/**
 * Controller function for user login.
 */
export const login = async (req: Request<{}, {}, LoginRequest>, res: Response<LoginResponse | AuthErrorResponse>) => {
  try {
    const { username, password } = req.body;

    const results = await queryAsync('SELECT * FROM users WHERE username = ?', [username]);

    if (results.length > 0) {
      const match = await bcrypt.compare(password, results[0].password);

      if (match) {
        const expirationTime = 3600; // 1 hour in seconds
        const token = jwt.sign(
          { username: results[0].username, id: results[0].id },
          process.env.JWT_SECRET as string,
          { expiresIn: expirationTime }
        );

        const userData: UserData = {
          email: results[0].email,
          name: results[0].name,
          username: results[0].username,
          user_image: results[0].user_image,
        };

        res.status(200).json({ token, userData, expiresIn: expirationTime });
      } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
      }
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};