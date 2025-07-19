# Profile Picture Upload Setup

## Overview
The application now supports profile picture uploads with two storage options:

1. **Cloudinary** (Recommended for production)
2. **Local Storage** (Fallback/Development)

## Features Added

### Frontend
- File upload interface in onboarding page
- File validation (JPEG, PNG, WebP, no size limit)
- Image preview functionality
- Option to remove selected files
- Random avatar generation (existing feature)
- Loading states during upload

### Backend
- Multer middleware for file handling
- Cloudinary integration for cloud storage
- Local storage fallback when Cloudinary is not configured
- File validation and security measures
- Rate limiting for uploads
- Image optimization (when using Cloudinary)

## Setup Instructions

### Option 1: Cloudinary Setup (Recommended)

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from the Cloudinary dashboard
3. Update the backend `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

### Option 2: Local Storage (Development)

If you don't configure Cloudinary, the app will automatically:
- Store images in `backend/uploads/profile-pics/`
- Serve images through the Express server
- This is suitable for development but not recommended for production

## API Endpoints

### Upload Profile Picture
- **POST** `/api/upload/profile-pic`
- **Authentication**: Required
- **Rate Limiting**: 20 uploads per 10 minutes
- **File Size**: No limit
- **Accepted Formats**: JPEG, PNG, WebP

**Request:**
```javascript
// FormData with 'profilePic' field
const formData = new FormData();
formData.append('profilePic', fileInput.files[0]);
```

**Response:**
```json
{
  "success": true,
  "message": "Profile picture uploaded successfully",
  "url": "https://res.cloudinary.com/your-cloud/image/upload/...",
  "public_id": "jharufy/profile-pics/abc123",
  "storage_type": "cloudinary"
}
```

## Security Features

- Authentication required for all uploads
- File type validation (images only)
- No file size limits
- Rate limiting to prevent abuse
- XSS and malicious file protection
- Automatic image optimization (Cloudinary)

## Usage in Onboarding Page

Users can now:
1. **Upload a custom image**: Click "Upload Photo" to select from device
2. **Generate random avatar**: Click "Random Avatar" for AI-generated profile pictures
3. **Preview before saving**: See the selected image before submitting
4. **Remove selection**: Remove selected file if they change their mind

## Development Notes

- The upload functionality integrates seamlessly with the existing onboarding flow
- Both storage options maintain the same frontend API
- File uploads are processed before form submission
- Validation messages provide clear feedback to users
- The feature gracefully degrades if Cloudinary is not configured

## Production Recommendations

1. **Use Cloudinary** for:
   - Automatic image optimization
   - CDN delivery
   - Better performance
   - Scalability

2. **Configure image transformations** in Cloudinary:
   - 400x400 profile pictures
   - Face-aware cropping
   - Automatic format selection
   - Quality optimization

3. **Monitor upload limits** and adjust rate limiting as needed

4. **Regular cleanup** of unused images (implement if needed)

## Troubleshooting

### Common Issues

1. **"Upload failed" error**:
   - Check Cloudinary credentials
   - Ensure file is a valid image format
   - Check network connectivity

2. **Images not displaying**:
   - For local storage: Check if backend serves static files
   - For Cloudinary: Verify URL accessibility

3. **Rate limiting**:
   - Wait before retrying
   - Check if hitting 20 uploads per 10 minutes limit

### Debug Mode

Set `NODE_ENV=development` to see detailed error logs and enable local storage fallback.
