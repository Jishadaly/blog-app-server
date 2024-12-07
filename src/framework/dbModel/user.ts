import mongoose, { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    userName: string;
    email: string;
    password: string;
    profilePic?: string;
    isGoogleUser: boolean;
    bio?: string;
}

const userSchema = new Schema<IUser>(
    {
        userName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
        },
        password: {
            type: String,
            required: true,
        },
        profilePic: {
            type: String,
        },
        isGoogleUser: {
            type: Boolean,
            default: false,
        },
        bio: {
            type: String,
            maxlength: 500,
        },
    },
    { timestamps: true }
);

export const Users = model<IUser>("Users", userSchema);
