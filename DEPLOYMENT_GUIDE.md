# 🚀 VERCEL DEPLOYMENT GUIDE - JHARUFY

## 📋 **PRE-DEPLOYMENT CHECKLIST**

- ✅ Project cleaned and optimized
- ✅ Frontend builds successfully  
- ✅ Backend configured for serverless
- ✅ Environment variables prepared
- ✅ Vercel configuration files ready

---

## 🌐 **DEPLOYMENT STRATEGY**

We'll deploy **3 separate projects** on different platforms:

1. **Frontend** → Vercel (Static Site)
2. **Backend API** → Vercel (Serverless Functions)
3. **Socket Server** → Railway (Always-on Server)

---

## 1️⃣ **FRONTEND DEPLOYMENT (Vercel)**

### **Step 1.1: Create Frontend Project**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Connect your GitHub account if not already connected
3. Import your repository: `jharufy`
4. **IMPORTANT**: Set these configurations:
   - **Project Name**: `jharufy` or `jharufy-frontend`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### **Step 1.2: Add Frontend Environment Variables**
In Vercel dashboard → Settings → Environment Variables, add:

```env
VITE_API_URL=https://jharufy-backend.vercel.app/api
VITE_SOCKET_URL=https://jharufy-socket.railway.app
VITE_STREAM_API_KEY=6k3ntrfz2e2w
VITE_CLOUDINARY_CLOUD_NAME=dh0gv9hju
VITE_CLOUDINARY_UPLOAD_PRESET=jharufy_preset
```

### **Step 1.3: Deploy Frontend**
- Click **Deploy**
- Wait for deployment to complete
- Your frontend will be available at: `https://jharufy.vercel.app`

---

## 2️⃣ **BACKEND API DEPLOYMENT (Vercel)**

### **Step 2.1: Create Backend Project**
1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import the **same repository**: `jharufy`
3. **IMPORTANT**: Set these configurations:
   - **Project Name**: `jharufy-backend`
   - **Framework Preset**: `Other`
   - **Root Directory**: `./backend`
   - **Build Command**: `npm install`
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`

### **Step 2.2: Add Backend Environment Variables**
In Vercel dashboard → Settings → Environment Variables, add:

```env
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

### **Step 2.3: Deploy Backend**
- Click **Deploy**
- Wait for deployment to complete
- Your backend will be available at: `https://jharufy-backend.vercel.app`

---

## 3️⃣ **SOCKET SERVER DEPLOYMENT (Railway)**

### **Step 3.1: Deploy to Railway**
1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Connect your GitHub account
4. Select **"Deploy from GitHub repo"**
5. Choose your `jharufy` repository
6. **IMPORTANT**: Set Root Directory to `./socket-server`

### **Step 3.2: Add Socket Server Environment Variables**
In Railway dashboard → Variables, add:

```env
CLIENT_URL=https://jharufy.vercel.app
NODE_ENV=production
PORT=5002
```

### **Step 3.3: Deploy Socket Server**
- Railway will automatically deploy
- Your socket server will be available at: `https://jharufy-socket.railway.app`

---

## 4️⃣ **POST-DEPLOYMENT CONFIGURATION**

### **Step 4.1: Update Frontend URLs**
After backend is deployed, update frontend environment variables:

1. Go to Frontend Vercel project → Settings → Environment Variables
2. Update `VITE_API_URL` to your actual backend URL
3. Redeploy frontend

### **Step 4.2: Update Backend CORS**
After frontend is deployed, update backend environment variables:

1. Go to Backend Vercel project → Settings → Environment Variables  
2. Update `CLIENT_URL` to your actual frontend URL
3. Redeploy backend

### **Step 4.3: Test Everything**
Visit your frontend URL and test:
- ✅ User registration/login
- ✅ Chat functionality
- ✅ File uploads
- ✅ Real-time features
- ✅ Mobile responsiveness

---

## 5️⃣ **MONITORING & MAINTENANCE**

### **Vercel Dashboard Monitoring**
- Check Function Logs for any errors
- Monitor build times and performance
- Set up alerts for failed deployments

### **Railway Dashboard Monitoring**
- Monitor socket server uptime
- Check memory and CPU usage
- Set up health checks

---

## 🔗 **FINAL DEPLOYMENT URLS**

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `https://jharufy.vercel.app` | Main application |
| **Backend API** | `https://jharufy-backend.vercel.app` | REST API endpoints |
| **Socket Server** | `https://jharufy-socket.railway.app` | Real-time features |

---

## ⚠️ **TROUBLESHOOTING**

### **Common Issues:**

1. **CORS Errors**: Make sure CLIENT_URL in backend matches frontend URL
2. **API Not Found**: Check VITE_API_URL in frontend environment variables
3. **Socket Connection Failed**: Verify VITE_SOCKET_URL and Railway deployment
4. **Build Failures**: Check build logs in Vercel dashboard

### **Quick Fixes:**
```bash
# Test local build before deployment
npm run build

# Check environment variables
cat .env.production

# Verify all URLs are correct
```

---

## 🎉 **SUCCESS!**

Once all three services are deployed and configured, your Jharufy language learning platform will be live and accessible worldwide!

**🌍 Share your app**: `https://jharufy.vercel.app`
