const jwt = require('jsonwebtoken');
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const SECRET_KEY =  process.env.JWT_SECRET; 

export const generateToken = (user:string ,email:string ) => {
   const  accessToken =  jwt.sign({userId : user, email :email  }, SECRET_KEY, {
        expiresIn: '7d'
    });


    return  accessToken 
};

export const verifyToken = (token:string) => {
    return jwt.verify(token, SECRET_KEY);
};
