import mongoose, { Schema, Document } from 'mongoose';

interface OTPDocument extends Document {
    email: string;
    otp: string;
    createdAt: Date;
}

const OTPSchema: Schema = new Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: '1m' } }, 
});

const OTP = mongoose.model<OTPDocument>('OTP', OTPSchema);
export default OTP;