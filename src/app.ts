import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { register, login } from './controllers/authController';
import { handleImageUpload } from './middleware/uploadsMiddleware';

dotenv.config();

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3001;


// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

app.use('/login', login);
app.use('/register', handleImageUpload, register);

app.get('*', (req, res) => {
  res.status(404).json({error: {type: "Not Found!", message: "The content you are looking for was not found!"}})
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
