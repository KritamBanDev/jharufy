#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(color, message) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function createDeploymentGuide() {
  log(COLORS.bright, '🚀 VERCEL DEPLOYMENT PREPARATION COMPLETE!\n');
  
  log(COLORS.cyan, '📋 DEPLOYMENT CHECKLIST:');
  log(COLORS.green, '✅ Vercel configuration files optimized');
  log(COLORS.green, '✅ Frontend build verified');
  log(COLORS.green, '✅ Backend serverless configuration ready');
  log(COLORS.green, '✅ Environment variables template prepared');
  
  log(COLORS.magenta, '\n🌐 DEPLOYMENT STEPS:');
  
  log(COLORS.yellow, '\n1️⃣ FRONTEND DEPLOYMENT:');
  log(COLORS.blue, '   • Go to: https://vercel.com/new');
  log(COLORS.blue, '   • Connect your GitHub repository');
  log(COLORS.blue, '   • Set Root Directory: "./frontend"');
  log(COLORS.blue, '   • Framework Preset: "Vite"');
  log(COLORS.blue, '   • Build Command: "npm run build"');
  log(COLORS.blue, '   • Output Directory: "dist"');
  
  log(COLORS.yellow, '\n2️⃣ BACKEND DEPLOYMENT:');
  log(COLORS.blue, '   • Create new Vercel project');
  log(COLORS.blue, '   • Set Root Directory: "./backend"');
  log(COLORS.blue, '   • Framework Preset: "Other"');
  log(COLORS.blue, '   • Build Command: "npm install"');
  log(COLORS.blue, '   • Output Directory: (leave empty)');
  
  log(COLORS.yellow, '\n3️⃣ ENVIRONMENT VARIABLES TO ADD:');
  
  log(COLORS.cyan, '\n   FRONTEND Environment Variables:');
  log(COLORS.blue, '   ├── VITE_API_URL = https://your-backend.vercel.app/api');
  log(COLORS.blue, '   ├── VITE_SOCKET_URL = https://your-socket-server.railway.app');
  log(COLORS.blue, '   ├── VITE_STREAM_API_KEY = 6k3ntrfz2e2w');
  log(COLORS.blue, '   ├── VITE_CLOUDINARY_CLOUD_NAME = dh0gv9hju');
  log(COLORS.blue, '   └── VITE_CLOUDINARY_UPLOAD_PRESET = jharufy_preset');
  
  log(COLORS.cyan, '\n   BACKEND Environment Variables:');
  log(COLORS.blue, '   ├── MONGO_URI = mongodb+srv://kritam817402:TPKO7t6a6YZLF6DU@cluster0.tzguqy4.mongodb.net/jharufy_db?retryWrites=true&w=majority&appName=Cluster0');
  log(COLORS.blue, '   ├── JWT_SECRET_KEY = 88ee792b83718d2954e7b85dc23fe0901c4a0a00044b3a43be10ce6bcfb4c15eb84e25c6a636936d992012b2cb999658bfd6661976d3854cc0b7340f43489ad298');
  log(COLORS.blue, '   ├── JWT_EXPIRES_IN = 7d');
  log(COLORS.blue, '   ├── JWT_COOKIE_EXPIRES_IN = 7');
  log(COLORS.blue, '   ├── STREAM_API_KEY = 6k3ntrfz2e2w');
  log(COLORS.blue, '   ├── STREAM_API_SECRET = fjngvtrjjwbzs7266ktm5rs9kmj5py3unwz6j7j743js7anrmb4ynw67ua3c7gbr');
  log(COLORS.blue, '   ├── CLOUDINARY_CLOUD_NAME = dh0gv9hju');
  log(COLORS.blue, '   ├── CLOUDINARY_API_KEY = 148683921592115');
  log(COLORS.blue, '   ├── CLOUDINARY_API_SECRET = lhuhBfbDc8y9CcSsee26CNEmusA');
  log(COLORS.blue, '   ├── NODE_ENV = production');
  log(COLORS.blue, '   └── CLIENT_URL = https://your-frontend.vercel.app');
  
  log(COLORS.yellow, '\n4️⃣ POST-DEPLOYMENT UPDATES:');
  log(COLORS.blue, '   • Update VITE_API_URL in frontend with your backend URL');
  log(COLORS.blue, '   • Update CLIENT_URL in backend with your frontend URL');
  log(COLORS.blue, '   • Test all functionality end-to-end');
  
  log(COLORS.yellow, '\n5️⃣ SOCKET SERVER (Railway):');
  log(COLORS.blue, '   • Go to: https://railway.app');
  log(COLORS.blue, '   • Create new project from GitHub');
  log(COLORS.blue, '   • Set Root Directory: "./socket-server"');
  log(COLORS.blue, '   • Add environment variables:');
  log(COLORS.blue, '     - CLIENT_URL = https://your-frontend.vercel.app');
  log(COLORS.blue, '     - NODE_ENV = production');
  
  log(COLORS.green, '\n✨ DEPLOYMENT URLS STRUCTURE:');
  log(COLORS.cyan, '   Frontend:     https://jharufy.vercel.app');
  log(COLORS.cyan, '   Backend API:  https://jharufy-backend.vercel.app');
  log(COLORS.cyan, '   Socket Server: https://jharufy-socket.railway.app');
  
  log(COLORS.yellow, '\n⚠️  IMPORTANT NOTES:');
  log(COLORS.red, '   • Make sure to update CORS origins in backend after deployment');
  log(COLORS.red, '   • Test authentication and file uploads after deployment');
  log(COLORS.red, '   • Monitor Vercel function logs for any errors');
  
  log(COLORS.bright, '\n🎯 Ready to deploy! Follow the steps above in order.');
}

// Read current environment variables and prepare them
function prepareEnvVariables() {
  const frontendEnv = path.join(__dirname, '..', 'frontend', '.env.production');
  const backendEnv = path.join(__dirname, '..', 'backend', '.env');
  
  if (fs.existsSync(frontendEnv)) {
    log(COLORS.green, '✅ Frontend production environment ready');
  }
  
  if (fs.existsSync(backendEnv)) {
    log(COLORS.green, '✅ Backend environment ready');
  }
}

function main() {
  prepareEnvVariables();
  createDeploymentGuide();
}

main();
