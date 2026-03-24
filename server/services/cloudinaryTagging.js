// מחלץ את מערך התגיות מתשובת Cloudinary
// מחזיר מערך ריק אם אין תגיות
export function extractTags(cloudinaryResult) {
  return cloudinaryResult.tags || [];
}
