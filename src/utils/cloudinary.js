import {v2 as cloudinary} from 'cloudinary';
import config from '../config/config.js';

cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
})

const uploadImage = async (filePath, folder) => {
    return await cloudinary.uploader.upload(filePath, {
        folder: folder
    })
}

const deleteImage = async (public_id) => {
    return await cloudinary.uploader.destroy(public_id);
}

export { uploadImage, deleteImage };