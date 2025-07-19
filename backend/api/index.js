import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// Basic middleware
app.use(cors({
  origin: [
    'https://jharufy-frontend.vercel.app',
    'https://*.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
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

// Auth endpoints
app.post('/api/auth/signup', (req, res) => {
  res.json({ 
    success: true,
    message: 'Signup endpoint working - connect database for full functionality',
    data: req.body
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ 
    success: true,
    message: 'Login endpoint working - connect database for full functionality',
    data: req.body
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ 
    success: true,
    message: 'Auth check endpoint working',
    user: null
  });
});

// Database connection helper
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      isConnected = true;
      console.log('Database connected');
    } else {
      console.log('No MONGO_URI provided - running without database');
    }
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

// Serverless handler
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
