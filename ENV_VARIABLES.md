# 🌐 VERCEL ENVIRONMENT VARIABLES

## 📱 FRONTEND ENVIRONMENT VARIABLES
Copy these to Vercel → Frontend Project → Settings → Environment Variables:

```
VITE_API_URL=https://jharufy-backend.vercel.app/api
VITE_SOCKET_URL=https://jharufy-socket.railway.app
VITE_STREAM_API_KEY=6k3ntrfz2e2w
VITE_CLOUDINARY_CLOUD_NAME=dh0gv9hju
VITE_CLOUDINARY_UPLOAD_PRESET=jharufy_preset
```

## 🖥️ BACKEND ENVIRONMENT VARIABLES
Copy these to Vercel → Backend Project → Settings → Environment Variables:

```
MONGO_URI=mongodb+srv://kritam817402:TPKO7t6a6YZLF6DU@cluster0.tzguqy4.mongodb.net/jharufy_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET_KEY=88ee792b83718d2954e7b85dc23fe0901c4a0a00044b3a43be10ce6bcfb4c15eb84e25c6a636936d992012b2cb999658bfd6661976d3854cc0b7340f43489ad298
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
STREAM_API_KEY=6k3ntrfz2e2w
STREAM_API_SECRET=fjngvtrjjwbzs7266ktm5rs9kmj5py3unwz6j7j743js7anrmb4ynw67ua3c7gbr
CLOUDINARY_CLOUD_NAME=dh0gv9hju
CLOUDINARY_API_KEY=148683921592115
CLOUDINARY_API_SECRET=lhuhBfbDc8y9CcSsee26CNEmusA
NODE_ENV=production
CLIENT_URL=https://jharufy.vercel.app
```

## 🔌 SOCKET SERVER ENVIRONMENT VARIABLES
Copy these to Railway → Socket Project → Variables:

```
CLIENT_URL=https://jharufy.vercel.app
NODE_ENV=production
PORT=5002
```

---

## 📝 STEP-BY-STEP INSTRUCTIONS:

### 1. FRONTEND DEPLOYMENT
1. Go to: https://vercel.com/new
2. Import repository: `jharufy`
3. Project settings:
   - Name: `jharufy`
   - Framework: `Vite`
   - Root Directory: `./frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables (copy from above)
5. Deploy!

### 2. BACKEND DEPLOYMENT  
1. Go to: https://vercel.com/new
2. Import repository: `jharufy` (same repo)
3. Project settings:
   - Name: `jharufy-backend`
   - Framework: `Other`
   - Root Directory: `./backend`
   - Build Command: `npm install`
   - Output Directory: (empty)
4. Add environment variables (copy from above)
5. Deploy!

### 3. SOCKET SERVER DEPLOYMENT
1. Go to: https://railway.app
2. New Project → Deploy from GitHub
3. Select repository: `jharufy`
4. Root Directory: `./socket-server`
5. Add environment variables (copy from above)
6. Deploy!

### 4. POST-DEPLOYMENT
- Update frontend `VITE_API_URL` with actual backend URL
- Update backend `CLIENT_URL` with actual frontend URL
- Test all functionality

🎉 **DONE!** Your app will be live at: `https://jharufy.vercel.app`
