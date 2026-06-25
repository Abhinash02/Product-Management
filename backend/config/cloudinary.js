const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary if environment variables are provided
const checkConfig = (val) => {
  if (!val) return false;
  const clean = val.trim().replace(/['"]/g, '');
  return clean.length > 0 && !clean.startsWith('your_');
};

const isCloudinaryConfigured = 
  checkConfig(process.env.CLOUDINARY_CLOUD_NAME) && 
  checkConfig(process.env.CLOUDINARY_API_KEY) && 
  checkConfig(process.env.CLOUDINARY_API_SECRET);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim().replace(/['"]/g, ''),
    api_key: process.env.CLOUDINARY_API_KEY.trim().replace(/['"]/g, ''),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim().replace(/['"]/g, '')
  });
  console.log('Cloudinary successfully configured.');
} else {
  console.log('Cloudinary credentials missing. Falling back to local file storage.');
}

/**
 * Uploads a file to Cloudinary or falls back to local storage URL
 * @param {string} localFilePath Path to the file on local disk
 * @returns {Promise<string>} The URL of the uploaded image
 */
const uploadToCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    if (isCloudinaryConfigured) {
      const result = await cloudinary.uploader.upload(localFilePath, {
        folder: 'product_marketplace',
        resource_type: 'image'
      });
      // Delete temporary local file
      try {
        fs.unlinkSync(localFilePath);
      } catch (err) {
        console.error('Error deleting temp file:', err.message);
      }
      return result.secure_url;
    } else {
      // Local fallback: Return the relative path served as a static asset
      // Since it's stored in public uploads, we return a path like '/uploads/filename'
      const filename = path.basename(localFilePath);
      return `/uploads/${filename}`;
    }
  } catch (error) {
    console.error('Upload error in helper:', error.message);
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  isCloudinaryConfigured
};
