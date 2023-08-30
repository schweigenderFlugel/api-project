import dotenv from 'dotenv';
dotenv.config();

const config = {
    mongoDbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    gmailAddress: process.env.GMAIL_ADDRESS,
    gmailPassword: process.env.GMAIL_PASSWORD,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET
}

export default config;