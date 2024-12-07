import { createHmac } from 'crypto';

export const Encrypt = {
    // SHA-256 Hashing Function
    cryptPassword: (password: string): string => {
        const secret = 'your_secret_key'; // Replace with a secure key
        return createHmac('sha256', secret).update(password).digest('hex');
    },

    // Compare Password with Hashed Password
    comparePassword: (password: string, hashPassword: string): boolean => {
        const secret = 'your_secret_key'; // Replace with the same secure key
        const hashedPassword = createHmac('sha256', secret).update(password).digest('hex');
        return hashedPassword === hashPassword;
    }
};
