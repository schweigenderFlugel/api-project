import {v2 as cloudinary} from 'cloudinary';
import config from '../config/config.js';

cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
    secure: true,
})

const uploadImage = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
        folder: 'products'
    })
}

export default uploadImage;