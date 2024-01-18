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
    const { first_name, last_name, email, password, username, phone_number, date_of_birth, role, cpf, rg } = req.body;

    const userExists = await queryAsync('SELECT * FROM users WHERE username = ?', [username]);
    const emailExists = await queryAsync('SELECT * FROM users WHERE email = ?', [email]);
    const phoneExists = await queryAsync('SELECT * FROM users WHERE phone_number = ?', [phone_number]);
    const cpfExists = await queryAsync('SELECT * FROM users WHERE cpf = ?', [cpf]);
    const rgExists = await queryAsync('SELECT * FROM users WHERE rg = ?', [rg]);

    if (userExists.length > 0) {
      return res.status(400).json({ error: 'Nome de usuário já em uso' });
    }

    if (emailExists.length > 0) {
      return res.status(400).json({ error: 'E-mail já em uso' });
    }

    if (phoneExists.length > 0) {
      return res.status(400).json({ error: 'Celular já em uso' });
    }

    if (cpfExists.length > 0) {
      return res.status(400).json({ error: 'CPF já em uso' });
    }

    if (rgExists.length > 0) {
      return res.status(400).json({ error: 'RG já em uso' });
    }

    const userRole = role == 'admin' ? 'admin' : 'user'

    const hashedPassword = await bcrypt.hash(password, 10);

    await queryAsync('INSERT INTO users (username, password_hash, email, first_name, last_name, phone_number, date_of_birth, role, cpf, rg, user_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [username, hashedPassword, email, first_name, last_name, phone_number, date_of_birth, userRole, cpf, rg, req.body.imagePath ? req.body.imagePath : null]);

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

    // Fetch user from the database
    const [user] = await queryAsync('SELECT id, password_hash, email, first_name, last_name, username, user_image FROM users WHERE username = ?', [username]);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (isPasswordValid) {
        const expirationTime = 3600; // 1 hour in seconds

        // Create JWT token
        const token = jwt.sign(
          { username: user.username, id: user.id },
          process.env.JWT_SECRET as string,
          { expiresIn: expirationTime }
        );

        // Extract relevant user data
        const { email, first_name, last_name, username, user_image } = user;

        // Send a clean response with token and user data
        const userData: UserData = { email, first_name, last_name, username, user_image };
        res.status(200).json({ token, userData, expiresIn: expirationTime });
      } else {
        // Incorrect password
        res.status(401).json({ error: 'Credenciais inválidas' });
      }
    } else {
      // User not found
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};
