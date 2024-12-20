    
import { Request, Response, NextFunction } from "express"
 
    
const multer = require('multer');

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const {
    CLOUDINARY_HOST,
CLOUDINARY_API_KEY,
CLOUDINARY_API_SECRET,  
} = process.env;

cloudinary.config({
    cloud_name:CLOUDINARY_HOST,
    api_key:CLOUDINARY_API_KEY,
    api_secret:CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        
        folder: "images_blog-image",
        format: async () => 'png',  // Change 'formate' to 'format'
        public_id: (req:Request, file:any) => file.originalname.split('.')[0],
    },
});

const parser = multer({storage:storage})

module.exports = parser;