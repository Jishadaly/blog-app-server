import mongoose, { model, Schema } from "mongoose";

export interface IBlog extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    tags?: string[];
    likes: number;
    isPublished: boolean;
}

const blogSchema = new Schema<IBlog>(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        tags: {
            type: [String],
        },
        likes: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const Blogs = model<IBlog>("Blogs", blogSchema);
