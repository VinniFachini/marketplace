import express from 'express';
import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { handleImageUpload } from '../middleware/uploadsMiddleware';

const router: Router = express.Router();

router.post('/register', handleImageUpload, register);
router.post('/login', login);

export default router;
