import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';

// Initialize Express application
const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

app.use('/auth', authRoutes);

app.get('*', (req, res) => {
  res.status(404).json({error: {type: "Not Found!", message: "The content you are looking for was not found!"}})
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
