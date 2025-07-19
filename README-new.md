# 🌍 Jharufy - Language Learning Social Platform

A modern, full-stack social media platform designed for language learners to connect, practice, and share their learning journey.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based user authentication
- 👥 **Social Networking** - Friend requests, profiles, and connections
- 💬 **Real-time Chat** - Powered by Stream Chat with video calling
- 📸 **Media Sharing** - Photo and video uploads via Cloudinary
- 🌐 **Multi-language Support** - Interface supports multiple languages
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Multiple Themes** - DaisyUI themes for personalization
- 🚀 **Progressive Web App** - Works offline and installable

## 🛠️ Tech Stack

### Frontend
- **React 18** with modern hooks
- **Vite** for lightning-fast development
- **TailwindCSS + DaisyUI** for styling
- **Zustand** for state management
- **React Query** for data fetching
- **Stream Chat React** for real-time messaging
- **TypeScript** for type safety

### Backend
- **Node.js + Express** API server
- **MongoDB + Mongoose** for database
- **Socket.IO** for real-time features
- **JWT** for authentication
- **Cloudinary** for file uploads
- **Stream Chat** for messaging backend

### DevOps & Deployment
- **Vercel** for frontend and API deployment
- **Railway** for Socket.IO server
- **GitHub Actions** for CI/CD
- **ESLint + Prettier** for code quality

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- MongoDB database
- Cloudinary account
- Stream Chat account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd jharufy
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` in both `frontend` and `backend` directories
   - Fill in your environment variables (see Configuration section)

4. **Start development servers**
   ```bash
   # Start all services (backend + frontend + socket)
   npm run dev:full
   
   # Or start individually
   npm run dev:backend  # Backend on :5001
   npm run dev:frontend # Frontend on :5173
   npm run dev:socket   # Socket server on :5002
   ```

## ⚙️ Configuration

### Backend Environment Variables (.env)
```env
# Database
MONGO_URI=your_mongodb_connection_string

# JWT Configuration  
JWT_SECRET_KEY=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Stream Chat
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend Environment Variables (.env.development)
```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5002
VITE_STREAM_API_KEY=your_stream_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 📜 Available Scripts

### Root Commands
- `npm run dev` - Start backend + frontend
- `npm run dev:full` - Start all services (backend + frontend + socket)
- `npm run build` - Build and lint entire project  
- `npm run test` - Run all tests
- `npm run lint` - Lint all projects
- `npm run install:all` - Install all dependencies

### Frontend Commands (in /frontend)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run Vitest tests

### Backend Commands (in /backend)
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm test` - Run Jest tests  
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
jharufy/
├── api/                    # Vercel API entry point
├── backend/               # Express.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   └── test/             # Backend tests
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilities & API client
│   │   ├── store/        # Zustand stores
│   │   └── styles/       # Global styles
│   └── public/           # Static assets
├── socket-server/        # Socket.IO server
├── monitoring/           # Grafana dashboards
└── scripts/              # Build and utility scripts
```

## 🧪 Testing

- **Backend**: Jest with supertest for API testing
- **Frontend**: Vitest with React Testing Library
- **E2E**: GitHub Actions CI/CD pipeline

Run tests:
```bash
npm run test           # All tests
npm run test:backend   # Backend only  
npm run test:frontend  # Frontend only
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables in Vercel dashboard

### Backend API (Vercel Serverless)
- Automatic deployment via `/api` directory
- Configure environment variables in Vercel

### Socket Server (Railway)
1. Connect repository to Railway
2. Deploy `/socket-server` directory
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`  
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Stream for chat and video infrastructure
- Cloudinary for media management
- DaisyUI for beautiful components
- Vercel and Railway for hosting

---

**Made with ❤️ by the Jharufy Team**
