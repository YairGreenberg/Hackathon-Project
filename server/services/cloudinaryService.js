import { v2 as cloudinary } from 'cloudinary';

// הגדרות החיבור (הנתונים יגיעו מקובץ ה-.env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * מעלה קובץ לענן ומחזיר את הקישור הישיר
 * @param {Stream} fileStream - הזרם של הקובץ שהורד מטלגרם
 */
export const uploadToCloudinary = (fileStream) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'telegram_bot' }, // שם התיקייה בענן
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url); // מחזיר לינק https ישיר
      }
    );

    fileStream.pipe(uploadStream);
  });
};

export const deleteFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};