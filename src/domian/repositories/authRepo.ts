
import { AuthRepositoryInterface } from "../interfaces/repositories/authInterfase";
import { IUser } from "../entities/types/User";
import { Users } from "../../framework/dbModel/user";
import OTP from "../../framework/dbModel/otp";
import { Encrypt } from "../helper/hashPassword";
import { Blogs, IBlog } from "../../framework/dbModel/blog";
import { IBlog as IBlogBody } from "../entities/types/IBlog";
import mongoose from "mongoose";

//implement repo code;
export class AuthRepositoryImpl implements AuthRepositoryInterface {

    async createUser(userData: IUser, hashedPassword: string): Promise<any | null> {
        console.log('repo data ', userData, hashedPassword);

        try {
            if (!userData.email || !userData.name) {
                throw new Error("Email and name are required");
            }
            const existingUser = await this.checkExistingUser(userData.email, userData.name);
            const existingUserName = await this.checkExistingName(userData.name);
            console.log(existingUserName);

            if (existingUserName) {
                if (existingUserName.verified === false) {
                    return existingUserName
                }
                throw new Error("A user with that username already exists.");
            }

            if (existingUser) {
                if (existingUser.verified === false) {
                    return existingUser
                }
                throw new Error("A user with that email already exists.");
            }
            const newUser = new Users({
                userName: userData.name,
                email: userData.email,
                password: hashedPassword,
            });
            return await newUser.save();

        } catch (error) {
            throw error
        }
    }



    async checkExistingUser(email: string, userName: string): Promise<any | null> {
        const existingUser = await Users.findOne({
            $or: [{ email: email }, { userName: userName }]
        });
        return existingUser;
    }


    async checkExistingName(userName: string): Promise<any | null> {
        const existingUser = await Users.findOne({ userName: userName });
        return existingUser;
    }

    async saveOtp(email: string, otp: string): Promise<any | null> {
        return await OTP.create({ email, otp });
    }

    async getStoredOtp(email: string): Promise<any | null> {
        return await OTP.findOne({ email: email }).sort({ createdAt: -1 }).exec();
    }

    async deleteAllOtp(email: string): Promise<any | null> {
        return await OTP.deleteMany({ email: email });
    }

    async verifyUserdb(email: string): Promise<any | null> {
        const userData = await Users.findOneAndUpdate(
            { email: email },
            { $set: { verified: true } },
            { new: true }
        );
        return userData;
    }

    async getUserbyEMail(email: string): Promise<any | null> {
        return await Users.findOne({ email: email })
    }

    async updateOtp(email: string, otp: string) {
        return await OTP.findOneAndUpdate({ email }, { otp, createdAt: new Date() }, { upsert: true });
    }

    async saveGoogleUser(userData: IUser) {

        if (!userData.name || !userData.email) {
            throw new Error("data is undefined")
        }

        const existingUser = await this.checkExistingUser(userData.name, userData.name);
        if (existingUser) {
            return existingUser
        }

        const generatedPss = Math.random().toString(36).slice(-8);
        const hashedPassword = await Encrypt.cryptPassword(generatedPss)

        const newUser = new Users({
            userName: userData.name,
            email: userData.email,
            password: hashedPassword,
            phone: userData.phone,
            isGoogleUser: true
        });

        return await newUser.save();
    }

    async createBlog(blogData: IBlogBody): Promise<any> {
        try {
            if (!blogData.title || !blogData.content || !blogData.userId) {
                throw new Error('Missing required fields: title, content, or author');
            }


            const sanitizedBlog: IBlogBody = {
                title: this.sanitizeText(blogData.title),
                content: this.sanitizeText(blogData.content),
                author: blogData.userId,
                tags: blogData.tags?.map(tag => this.sanitizeText(tag)),
                imageUrl: blogData.imageUrl,
                isPublished: blogData.isPublished ?? false
            };


            const newBlog = await Blogs.create(sanitizedBlog);
            const populatedBlog = await newBlog.populate('author', 'name email');

            return populatedBlog;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to create blog: ${error.message}`);
            }
            throw new Error('Failed to create blog: Unknown error occurred');
        }
    }

    private sanitizeText(text: string): string {
        return text
            .trim()
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .replace(/[<>]/g, '');
    }

    async findBlogByTitle(title: string): Promise<IBlog | null> {
        return await Blogs.findOne({ title });
    }

    async getStoredBlogs(): Promise<IBlog[] | null> {
        return await Blogs.find().sort({ createdAt: -1 });
    }

}