import cloudinary from 'cloudinary';
import { config } from 'dotenv';
config({ path: '.env' });

const Cloudinary = cloudinary.v2;

Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

export const uplaodImage = async (image: string) => {
  let result;
  try {
    result = await cloudinary.v2.uploader.upload(image, {
      allowed_formats: ['jpg', 'png'],
      folder: 'products',
    });
  } catch (e) {
    return `Image could not be uploaded:${e.message}`;
  }

  return `Successful-Image URL: ${result.url}`;
};
