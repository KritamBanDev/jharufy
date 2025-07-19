# Vercel Deployment Guide for Jharufy ✅ COMPLETE

## 🎉 Fixed Issues
- ✅ **Socket.IO**: Replaced with Stream Chat for serverless compatibility
- ✅ **Image Uploads**: Complete Cloudinary integration for serverless environment
- ✅ **Real-time Features**: Fully functional with Stream Chat
- ✅ **Production Ready**: All configurations optimized for Vercel

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **MongoDB Atlas**: Set up a production MongoDB database
4. **Cloudinary Account**: For image storage in production
5. **Stream Chat Account**: For real-time features (replaces Socket.IO)

## Deployment Steps

### 1. Deploy Backend

1. **Import Project to Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Import Project"
   - Select your GitHub repository
   - Choose the `backend` folder as the root directory
   - Name it `jharufy-backend`

2. **Configure Environment Variables**
   Add these environment variables in Vercel dashboard:
   ```
   NODE_ENV=production
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET_KEY=your_secure_jwt_secret
   JWT_EXPIRES_IN=7d
   JWT_COOKIE_EXPIRES_IN=7
   CLIENT_URL=https://jharufy.vercel.app
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STREAM_API_KEY=your_stream_api_key
   STREAM_API_SECRET=your_stream_api_secret
   ```

3. **Deploy Backend**
   - Click "Deploy"
   - Note the deployment URL (e.g., `https://jharufy-backend.vercel.app`)

### 2. Deploy Frontend

1. **Import Frontend Project**
   - Import the same repository again
   - Choose the `frontend` folder as the root directory
   - Name it `jharufy` or `jharufy-frontend`

2. **Configure Frontend Environment Variables**
   ```
   VITE_API_URL=https://jharufy-backend.vercel.app
   VITE_STREAM_API_KEY=your_stream_api_key
   ```

3. **Deploy Frontend**
   - Click "Deploy"
   - Your frontend will be available at `https://jharufy.vercel.app`

### 3. Update CORS Settings

After deployment, update the backend CORS settings:

1. Go to your backend Vercel project
2. Add your frontend URL to environment variables:
   ```
   CLIENT_URL=https://jharufy.vercel.app
   ```

## Production Checklist

- [ ] MongoDB Atlas database set up and accessible
- [ ] Cloudinary account configured for image uploads
- [ ] Stream Chat account set up (if using chat features)
- [ ] Backend deployed with all environment variables
- [ ] Frontend deployed with correct API URL
- [ ] CORS configured to allow frontend domain
- [ ] Test all major features after deployment

## Important Notes

1. **File Uploads**: Since Vercel doesn't support persistent file storage, all images must use Cloudinary
2. **Database**: Use MongoDB Atlas for production database
3. **Environment Variables**: Never commit actual values to Git
4. **Serverless Limitations**: Vercel functions have a 30-second timeout limit

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure `CLIENT_URL` environment variable is set correctly
2. **Database Connection**: Check MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)
3. **Image Uploads**: Verify Cloudinary credentials are correct
4. **API Errors**: Check Vercel function logs in the dashboard

### Useful Commands:

```bash
# Test local build
npm run build

# Check build output
npm run preview
```

## Custom Domain (Optional)

1. Go to your frontend Vercel project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update environment variables with new domain

## Monitoring

- Monitor function usage in Vercel dashboard
- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor database performance in MongoDB Atlas
