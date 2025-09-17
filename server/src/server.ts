import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import questionRoutes from './routes/questionRoutes';

dotenv.config();   //Loads .env variables

const app = express();

// connect To MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', questionRoutes);

//Example route
app.get('/', (req, res) => {
  res.send("Server is running!")
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
});