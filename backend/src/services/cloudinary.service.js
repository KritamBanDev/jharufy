import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../utils/errorHandler.js';

/**
 * Cloudinary service for image uploads in serverless environment
 * This replaces local file storage for Vercel deployment
 */

class CloudinaryService {
  constructor() {
    this.isConfigured = false;
    this.configure();
  }

  configure() {
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
      });

      // Validate configuration
      if (!process.env.CLOUDINARY_CLOUD_NAME || 
          !process.env.CLOUDINARY_API_KEY || 
          !process.env.CLOUDINARY_API_SECRET) {
        throw new Error('Missing Cloudinary configuration variables');
      }

      this.isConfigured = true;
      console.log('✅ Cloudinary configured successfully');
    } catch (error) {
      console.error('❌ Cloudinary configuration failed:', error.message);
      throw new AppError('Cloudinary configuration failed', 500);
    }
  }

  /**
   * Upload image from buffer (for serverless compatibility)
   */
  async uploadImage(buffer, options = {}) {
    if (!this.isConfigured) {
      throw new AppError('Cloudinary not configured', 500);
    }

    const defaultOptions = {
      resource_type: 'image',
      folder: 'jharufy',
      format: 'webp',
      quality: 'auto:good',
      fetch_format: 'auto',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    };

    const uploadOptions = { ...defaultOptions, ...options };

    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      console.log(`✅ Image uploaded to Cloudinary: ${result.public_id}`);
      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        resourceType: result.resource_type
      };
    } catch (error) {
      console.error('❌ Cloudinary upload failed:', error);
      throw new AppError('Image upload failed', 500);
    }
  }

  /**
   * Upload profile picture with specific optimizations
   */
  async uploadProfilePicture(buffer, userId) {
    const options = {
      folder: 'jharufy/profiles',
      public_id: `profile_${userId}_${Date.now()}`,
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ],
      overwrite: true
    };

    return this.uploadImage(buffer, options);
  }

  /**
   * Upload status image with specific optimizations
   */
  async uploadStatusImage(buffer, userId) {
    const options = {
      folder: 'jharufy/status',
      public_id: `status_${userId}_${Date.now()}`,
      transformation: [
        { width: 1080, height: 1080, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    };

    return this.uploadImage(buffer, options);
  }

  /**
   * Upload multiple images for status posts
   */
  async uploadMultipleImages(buffers, userId, type = 'status') {
    const uploadPromises = buffers.map((buffer, index) => {
      const options = {
        folder: `jharufy/${type}`,
        public_id: `${type}_${userId}_${Date.now()}_${index}`,
        transformation: [
          { width: 1080, height: 1080, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      };
      return this.uploadImage(buffer, options);
    });

    try {
      const results = await Promise.all(uploadPromises);
      console.log(`✅ Uploaded ${results.length} images to Cloudinary`);
      return results;
    } catch (error) {
      console.error('❌ Multiple image upload failed:', error);
      throw new AppError('Multiple image upload failed', 500);
    }
  }

  /**
   * Delete image from Cloudinary
   */
  async deleteImage(publicId) {
    if (!this.isConfigured) {
      throw new AppError('Cloudinary not configured', 500);
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log(`✅ Image deleted from Cloudinary: ${publicId}`);
      return result;
    } catch (error) {
      console.error('❌ Cloudinary deletion failed:', error);
      throw new AppError('Image deletion failed', 500);
    }
  }

  /**
   * Get optimized image URL with transformations
   */
  getOptimizedUrl(publicId, transformations = {}) {
    if (!this.isConfigured) {
      throw new AppError('Cloudinary not configured', 500);
    }

    const defaultTransformations = {
      quality: 'auto:good',
      fetch_format: 'auto'
    };

    const finalTransformations = { ...defaultTransformations, ...transformations };

    return cloudinary.url(publicId, finalTransformations);
  }

  /**
   * Generate responsive image URLs for different screen sizes
   */
  getResponsiveUrls(publicId) {
    return {
      thumbnail: this.getOptimizedUrl(publicId, { width: 150, height: 150, crop: 'fill' }),
      small: this.getOptimizedUrl(publicId, { width: 400, height: 400, crop: 'limit' }),
      medium: this.getOptimizedUrl(publicId, { width: 800, height: 800, crop: 'limit' }),
      large: this.getOptimizedUrl(publicId, { width: 1200, height: 1200, crop: 'limit' }),
      original: this.getOptimizedUrl(publicId)
    };
  }

  /**
   * Health check for Cloudinary service
   */
  async healthCheck() {
    try {
      await cloudinary.api.ping();
      return { status: 'healthy', service: 'cloudinary' };
    } catch (error) {
      console.error('❌ Cloudinary health check failed:', error);
      return { status: 'unhealthy', service: 'cloudinary', error: error.message };
    }
  }
}

// Create singleton instance
const cloudinaryService = new CloudinaryService();

export default cloudinaryService;