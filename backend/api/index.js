import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// Basic middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Jharufy Backend API',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API working perfectly!',
    timestamp: new Date().toISOString()
  });
});

// Simple auth endpoint
app.post('/api/auth/test', (req, res) => {
  res.json({ 
    message: 'Auth endpoint working!',
    data: req.body
  });
});

// Database connection helper
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/test');
    isConnected = true;
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

// Serverless handler
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
