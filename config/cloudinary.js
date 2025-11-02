import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mi-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || 'el-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'no digas pero es el -api-secret',
});
    console.log(`✅ SYE CLOUD`);

export default cloudinary;
