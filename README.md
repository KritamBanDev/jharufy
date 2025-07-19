# 🌍 Jharufy - Language Learning Social Platform

<div align="center">

![Jharufy Banner](https://via.placeholder.com/800x200/4f46e5/white?text=Jharufy+-+Language+Learning+Social+Platform)

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://jharufy.vercel.app)
[![MIT License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)

**A modern, full-stack social media platform designed for language learners to connect, practice, and share their learning journey.**

[🚀 Live Demo](https://jharufy.vercel.app) • [📖 Documentation](./DEPLOYMENT_GUIDE.md) • [🐛 Report Bug](https://github.com/your-username/jharufy/issues) • [✨ Request Feature](https://github.com/your-username/jharufy/issues)

</div>

---

## ✨ Features

<div align="center">

| 🔐 **Authentication** | 👥 **Social** | 💬 **Communication** | 📱 **Modern** |
|:---:|:---:|:---:|:---:|
| JWT-based security | Friend system | Real-time chat | Responsive design |
| Secure sessions | User profiles | Video calling | PWA support |
| Password encryption | Activity feeds | File sharing | Dark/Light themes |

</div>

### 🌟 **Core Features**
- 🔐 **Secure Authentication** - JWT-based user authentication with password encryption
- 👥 **Social Networking** - Friend requests, user profiles, and social connections
- 💬 **Real-time Chat** - Powered by Stream Chat with video calling capabilities
- 📸 **Media Sharing** - Photo and video uploads via Cloudinary integration
- 🌐 **Multi-language Support** - Interface supports multiple languages
- 📱 **Responsive Design** - Perfect experience on mobile, tablet, and desktop
- 🎨 **29 Themes** - Beautiful DaisyUI themes for personalization
- 🚀 **Progressive Web App** - Works offline and installable on devices

---

## �️ Tech Stack

<div align="center">

### **Frontend**
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-4.5-646cff?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-06b6d4?style=flat-square&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6?style=flat-square&logo=typescript)

### **Backend**
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-7.8-47a248?style=flat-square&logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-010101?style=flat-square&logo=socket.io)

### **DevOps & Services**
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel)
![Railway](https://img.shields.io/badge/Railway-0b0d0e?style=flat-square&logo=railway)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448c5?style=flat-square&logo=cloudinary)
![Stream](https://img.shields.io/badge/Stream-005fff?style=flat-square&logo=getstream)

</div>

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm 8+
- MongoDB database
- Cloudinary account
- Stream Chat account

### **Installation**

```bash
# Clone the repository
git clone https://github.com/your-username/jharufy.git
cd jharufy

# Install all dependencies
npm run install:all

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.development
# Fill in your environment variables

# Start development servers
npm run dev:full
```

**🌐 Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001
- Socket Server: http://localhost:5002

---

## ⚙️ Configuration

<details>
<summary><strong>📁 Environment Variables</strong></summary>

### **Backend (.env)**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secure_jwt_secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### **Frontend (.env.development)**
```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5002
VITE_STREAM_API_KEY=your_stream_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

</details>

---

## 📜 Available Scripts

<details>
<summary><strong>🔧 Development Commands</strong></summary>

```bash
# Development
npm run dev              # Start backend + frontend
npm run dev:full         # Start all services (backend + frontend + socket)
npm run dev:backend      # Backend only
npm run dev:frontend     # Frontend only
npm run dev:socket       # Socket server only

# Building
npm run build            # Build and lint entire project
npm run build:frontend   # Build frontend only

# Testing & Quality
npm run test             # Run all tests
npm run lint             # Lint all projects
npm run format           # Format code

# Maintenance
npm run install:all      # Install all dependencies
npm run clean            # Clean and reinstall dependencies
```

</details>

---

## 🏗️ Project Structure

```
jharufy/
├── 📁 api/                    # Vercel API entry point
├── 📁 backend/               # Express.js backend
│   ├── 📁 src/
│   │   ├── 📁 controllers/   # Route controllers
│   │   ├── 📁 middleware/    # Express middleware
│   │   ├── 📁 models/        # Mongoose models
│   │   ├── 📁 routes/        # API routes
│   │   ├── 📁 services/      # Business logic
│   │   └── 📁 utils/         # Utility functions
│   └── 📁 test/             # Backend tests
├── 📁 frontend/             # React frontend
│   ├── 📁 src/
│   │   ├── 📁 components/   # Reusable components
│   │   ├── 📁 pages/        # Page components
│   │   ├── 📁 hooks/        # Custom hooks
│   │   ├── 📁 lib/          # Utilities & API client
│   │   ├── 📁 store/        # Zustand stores
│   │   └── 📁 styles/       # Global styles
│   └── 📁 public/           # Static assets
├── 📁 socket-server/        # Socket.IO server
├── 📁 monitoring/           # Grafana dashboards
├── 📁 scripts/              # Build and utility scripts
└── 📄 DEPLOYMENT_GUIDE.md   # Deployment instructions
```

---

## 🚀 Deployment

This project is optimized for deployment on **Vercel** and **Railway**:

- **Frontend & Backend API**: Deploy to Vercel
- **Socket Server**: Deploy to Railway
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary
- **Real-time Chat**: Stream Chat

📖 **[Complete Deployment Guide](./DEPLOYMENT_GUIDE.md)**

---

## 🧪 Testing

```bash
npm run test           # All tests
npm run test:backend   # Backend only  
npm run test:frontend  # Frontend only
npm run test:coverage  # With coverage report
```

**Testing Stack:**
- **Backend**: Jest with Supertest
- **Frontend**: Vitest with React Testing Library
- **E2E**: GitHub Actions CI/CD

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

<div align="center">

Special thanks to these amazing services and libraries:

[![Stream](https://img.shields.io/badge/Stream-Chat%20%26%20Video-005fff?style=for-the-badge)](https://getstream.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Management-3448c5?style=for-the-badge)](https://cloudinary.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-Beautiful%20Components-5a67d8?style=for-the-badge)](https://daisyui.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Hosting-000000?style=for-the-badge)](https://vercel.com/)

</div>

---

<div align="center">

**Made with ❤️ by the Jharufy Team**

🌍 **[Visit Live App](https://jharufy.vercel.app)** • ⭐ **Star this repo if you found it helpful!**

</div>
- Stream Chat Account
- Cloudinary Account

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/jharufy.git
cd jharufy
\`\`\`

2. Install dependencies:
\`\`\`bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
\`\`\`

3. Set up environment variables:
- Copy \`.env.example\` to \`.env\` in both frontend and backend directories
- Fill in your environment variables

4. Start the development servers:
\`\`\`bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm run dev
\`\`\`

## Development

### Code Style
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks

### Testing
- Jest for backend testing
- Vitest for frontend testing
- React Testing Library for component testing

### Available Scripts

Frontend:
- \`npm run dev\`: Start development server
- \`npm run build\`: Build for production
- \`npm run build:vercel\`: Build for Vercel deployment
- \`npm run preview\`: Preview production build
- \`npm run lint\`: Run ESLint
- \`npm run format\`: Format code with Prettier
- \`npm test\`: Run tests

Backend:
- \`npm run dev\`: Start development server
- \`npm start\`: Start production server
- \`npm run build\`: Build for production
- \`npm test\`: Run tests
- \`npm run lint\`: Run ESLint
- \`npm run format\`: Format code with Prettier

## 🚀 Deployment

### Vercel Deployment

This app is configured for deployment on Vercel with separate frontend and backend deployments.

#### Quick Deploy
1. **Install Vercel CLI**: \`npm install -g vercel\`
2. **Run pre-deployment check**: \`node vercel-check.js\`
3. **Deploy**: \`./deploy.bat\` (Windows) or \`./deploy.sh\` (Unix)

#### Manual Deployment Steps

1. **Prepare Environment Variables**
   - Copy \`.env.template\` to set up your environment variables
   - Add variables to Vercel dashboard for each deployment

2. **Deploy Backend**
   \`\`\`bash
   cd backend
   vercel --prod
   \`\`\`

3. **Deploy Frontend**
   \`\`\`bash
   cd frontend
   vercel --prod
   \`\`\`

4. **Deploy Root (Optional)**
   \`\`\`bash
   vercel --prod
   \`\`\`

#### Environment Variables Required

**Frontend**:
- \`VITE_API_URL\`: Backend API URL
- \`VITE_STREAM_API_KEY\`: Stream Chat API key
- \`VITE_CLOUDINARY_CLOUD_NAME\`: Cloudinary cloud name
- \`VITE_CLOUDINARY_UPLOAD_PRESET\`: Cloudinary upload preset

**Backend**:
- \`NODE_ENV\`: production
- \`MONGODB_URI\`: MongoDB connection string
- \`JWT_SECRET\`: JWT secret key
- \`STREAM_API_KEY\`: Stream Chat API key
- \`STREAM_API_SECRET\`: Stream Chat API secret
- \`STREAM_APP_ID\`: Stream Chat App ID
- \`CLOUDINARY_CLOUD_NAME\`: Cloudinary cloud name
- \`CLOUDINARY_API_KEY\`: Cloudinary API key
- \`CLOUDINARY_API_SECRET\`: Cloudinary API secret

For detailed deployment instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Stream Chat](https://getstream.io/chat/)
- [TailwindCSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [React Query](https://tanstack.com/query/)
