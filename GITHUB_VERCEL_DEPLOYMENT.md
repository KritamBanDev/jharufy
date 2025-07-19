# 🚀 COMPLETE GITHUB + VERCEL DEPLOYMENT GUIDE

## 🎯 **DEPLOYMENT OVERVIEW**

We'll deploy your Jharufy project in this order:
1. **GitHub** - Push your code to version control
2. **Vercel** - Deploy frontend and backend from GitHub
3. **Railway** - Deploy socket server
4. **Configuration** - Connect all services

---

## 📂 **STEP 1: PUSH TO GITHUB**

### **1.1 Create GitHub Repository**

1. **Go to [github.com/new](https://github.com/new)**
2. **Fill in repository details:**
   ```
   Repository name: jharufy
   Description: 🌍 Language Learning Social Platform - Full-stack app for language learners
   Visibility: Public ✅ (required for free Vercel deployment)
   
   ❌ DO NOT check:
   - Add a README file
   - Add .gitignore  
   - Choose a license
   ```
3. **Click "Create repository"**

### **1.2 Connect Local Repository to GitHub**

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
# Add your GitHub repository as remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/jharufy.git

# Push to GitHub
git push -u origin main
```

**🎉 Your code is now on GitHub!**

---

## 🌐 **STEP 2: DEPLOY TO VERCEL**

### **2.1 Deploy Frontend**

1. **Go to [vercel.com/new](https://vercel.com/new)**
2. **Connect GitHub account** (if not already connected)
3. **Import your repository:** Search for `jharufy` and click "Import"
4. **Configure project:**
   ```
   Project Name: jharufy
   Framework Preset: Vite
   Root Directory: ./frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Add Environment Variables** (click "Environment Variables"):
   ```env
   VITE_API_URL=https://jharufy-backend.vercel.app/api
   VITE_SOCKET_URL=https://jharufy-socket.railway.app
   VITE_STREAM_API_KEY=6k3ntrfz2e2w
   VITE_CLOUDINARY_CLOUD_NAME=dh0gv9hju
   VITE_CLOUDINARY_UPLOAD_PRESET=jharufy_preset
   ```

6. **Click "Deploy"**

**📱 Frontend URL:** `https://jharufy.vercel.app`

### **2.2 Deploy Backend API**

1. **Go to [vercel.com/new](https://vercel.com/new) again**
2. **Import the SAME repository:** `jharufy`
3. **Configure project:**
   ```
   Project Name: jharufy-backend
   Framework Preset: Other
   Root Directory: ./backend
   Build Command: npm install
   Output Directory: (leave empty)
   Install Command: npm install
   ```

4. **Add Environment Variables:**
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

5. **Click "Deploy"**

**🖥️ Backend URL:** `https://jharufy-backend.vercel.app`

---

## 🔌 **STEP 3: DEPLOY SOCKET SERVER (Railway)**

### **3.1 Deploy to Railway**

1. **Go to [railway.app](https://railway.app)**
2. **Click "Start a New Project"**
3. **Connect GitHub** (if not connected)
4. **Deploy from GitHub repo:**
   - Select your `jharufy` repository
   - Set **Root Directory:** `./socket-server`

### **3.2 Configure Socket Server**

1. **Add Environment Variables** in Railway dashboard:
   ```env
   CLIENT_URL=https://jharufy.vercel.app
   NODE_ENV=production
   PORT=5002
   ```

2. **Deploy will start automatically**

**🔌 Socket URL:** `https://jharufy-socket.railway.app`

---

## 🔗 **STEP 4: UPDATE URLS (IMPORTANT!)**

After all services are deployed, you need to update the URLs:

### **4.1 Update Frontend Environment Variables**

1. **Go to Vercel Dashboard → jharufy project → Settings → Environment Variables**
2. **Update these variables with ACTUAL URLs:**
   ```env
   VITE_API_URL=https://your-actual-backend-url.vercel.app/api
   VITE_SOCKET_URL=https://your-actual-socket-url.railway.app
   ```
3. **Redeploy frontend**

### **4.2 Update Backend Environment Variables**

1. **Go to Vercel Dashboard → jharufy-backend project → Settings → Environment Variables**
2. **Update CLIENT_URL:**
   ```env
   CLIENT_URL=https://your-actual-frontend-url.vercel.app
   ```
3. **Redeploy backend**

### **4.3 Update Socket Server**

1. **Go to Railway Dashboard → Variables**
2. **Update CLIENT_URL:**
   ```env
   CLIENT_URL=https://your-actual-frontend-url.vercel.app
   ```

---

## ✅ **STEP 5: FINAL TESTING**

1. **Visit your frontend URL**
2. **Test these features:**
   - ✅ User registration/login
   - ✅ Profile creation
   - ✅ Chat functionality
   - ✅ File uploads
   - ✅ Real-time notifications
   - ✅ Mobile responsiveness

---

## 🎉 **SUCCESS! YOUR APP IS LIVE**

### **🌐 Final URLs:**
- **Frontend:** `https://jharufy.vercel.app`
- **Backend API:** `https://jharufy-backend.vercel.app`
- **Socket Server:** `https://jharufy-socket.railway.app`

### **🔄 Auto-Deployment:**
- Every push to `main` branch will automatically deploy to Vercel
- Your app stays up-to-date with your code changes

### **📊 Monitoring:**
- **Vercel Dashboard:** Monitor deployments, functions, and analytics
- **Railway Dashboard:** Monitor socket server uptime and performance
- **GitHub:** Track code changes and collaboration

---

## 🛠️ **TROUBLESHOOTING**

### **Common Issues:**

1. **"Module not found" errors:** Check if all dependencies are in the correct package.json
2. **CORS errors:** Verify CLIENT_URL in backend matches frontend URL
3. **API not found:** Check VITE_API_URL in frontend environment variables
4. **Build failures:** Check build logs in Vercel dashboard

### **Quick Fixes:**
```bash
# If you need to update and redeploy
git add .
git commit -m "Fix: Update configuration"
git push origin main
# Vercel will auto-deploy
```

---

## 🎯 **NEXT STEPS**

1. **Share your app:** `https://jharufy.vercel.app`
2. **Monitor performance** in Vercel and Railway dashboards
3. **Add custom domain** (optional)
4. **Set up analytics** (optional)
5. **Scale as needed** based on usage

**🌍 Your language learning platform is now live and accessible worldwide!**
