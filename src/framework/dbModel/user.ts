import mongoose, { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    userName: string;
    email: string;
    password: string;
    profilePic?: string;
    isGoogleUser: boolean;
    bio?: string;
    verified?:boolean
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
        verified : {
            type:Boolean,
            require:true,
            default:false
        },
        
    },
    { timestamps: true }
);

export const Users = model<IUser>("Users", userSchema);
