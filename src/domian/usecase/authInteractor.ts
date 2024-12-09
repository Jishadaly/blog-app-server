
import { AuthInterface } from "../interfaces/usecases/authInterface";
import { AuthRepositoryInterface } from "../interfaces/repositories/authInterfase";
import { IUser } from "../entities/types/User";
import { Encrypt } from "../helper/hashPassword";
import { otpGeneratorFun } from "../utils/otpGenerator";
import { generateOtpEmailContent, generateResendOtpEmailContent } from "../../utils/mailerContentGen";
import sendMail from "../helper/sendMail";
import { generateToken } from "../helper/jwtHelper";
import { IBlog } from "../entities/types/IBlog";

export class AthInteractorImpl implements AuthInterface {

    constructor(private readonly Repository: AuthRepositoryInterface) { }

    async registerUser(userData: IUser): Promise<any> {
        console.log('dattaaaaaa', userData);

        try {
            if (!userData.password) {
                throw new Error("Password is required.");
            }
            const hashedPassword = Encrypt.cryptPassword(userData.password);
            const savedUser = await this.Repository.createUser(userData, hashedPassword);
            if (savedUser) {
                const otp = otpGeneratorFun();
                console.log("OTP : ", otp);

                const Savedotp = await this.Repository.saveOtp(savedUser.email, otp);
                console.log('savedOTP', Savedotp, savedUser.email);

                const emailContent = generateOtpEmailContent(savedUser.userName, otp);
                sendMail(savedUser.email, emailContent);
            } else {
                throw Error("User registration failed");
            }

            return savedUser;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async verifyUser(data: { otp: string, email: string }): Promise<any> {

        try {
            const otpRecord = await this.Repository.getStoredOtp(data.email)

            console.log(otpRecord, data.email);
            console.log(data.otp);



            if (!otpRecord || otpRecord.otp !== data.otp) {
                throw Error("Invalid OTP");
            }

            const otpAge = Date.now() - otpRecord.createdAt.getTime();
            const expireOTP = 1 * 60 * 1000;

            if (otpAge > expireOTP) {
                await this.Repository.deleteAllOtp(otpRecord.email);
                throw new Error('OTP expired');
            }

            // Clear OTP from db after successful verification  
            await this.Repository.deleteAllOtp(otpRecord.email);

            return await this.Repository.verifyUserdb(data.email);
        } catch (error) {
            throw error
        }
    }

    async loginUser(email: string, password: string): Promise<any> {
        try {
            const existingUser = await this.Repository.getUserbyEMail(email);
            if (!existingUser) {
                throw new Error('No account found with this email address.');
            }
            console.log(password);

            const isValid = await Encrypt.comparePassword(password, existingUser.password);
            if (!isValid) {
                throw new Error("Invalid password");
            }

            const token = generateToken(existingUser.id, email);
            const user = {
                id: existingUser.id,
                name: existingUser.userName,
                email: existingUser.email,

            }
            const accessToken = token
            return { accessToken, user };
        } catch (error: any) {
            throw error
        }
    }

    async resendOtp(email: string) {
        try {
            const user = await this.Repository.getUserbyEMail(email);
            if (!user) {
                throw Error("User not found");
            }
            const otp = otpGeneratorFun();
            console.log("RESENT OTP", otp);
            await this.Repository.updateOtp(email, otp);
            const emailContent = generateResendOtpEmailContent(user.userName, otp);
            await sendMail(user.email, emailContent);
            return user
        } catch (error) {
            throw error
        }
    }


    async googleAuth(userData: IUser) {

        try {
            const savedUser = await this.Repository.saveGoogleUser(userData);
            if (savedUser) {
                const user = {
                    id: savedUser._id,
                    name: savedUser.userName,
                    email: savedUser.email,
                    phone: savedUser.phone,
                }

                let token = generateToken(savedUser.id, savedUser.email);
                console.log('google auth tocken', token);

                return { user, token };
            }
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            throw error;
        }
    }

    async createBlog(blogData: IBlog): Promise<IBlog> {
        try {
            
            if (!blogData.title?.trim()) {
                throw new Error('Blog title is required');
            }
            if (!blogData.brief?.trim()) {
                throw new Error('Blog brief is required');
            }
            if (!blogData.content?.trim()) {
                throw new Error('Blog content is required');
            }
            if (!blogData.userId) {
                throw new Error('User ID is required');
            }

           
            if (blogData.title.length < 5 || blogData.title.length > 100) {
                throw new Error('Blog title must be between 5 and 100 characters');
            }
            if (blogData.brief.length < 10 || blogData.brief.length > 200) {
                throw new Error('Blog brief must be between 10 and 200 characters');
            }
            if (blogData.content.length < 100) {
                throw new Error('Blog content must be at least 100 characters');
            }

           
            const existingBlog = await this.Repository.findBlogByTitle(blogData.title);
            if (existingBlog) {
                throw new Error('A blog with this title already exists');
            }

            
            const sanitizedBlog: IBlog = {
                title: blogData.title.trim(),
                brief: blogData.brief.trim(),
                content: blogData.content.trim(),
                userId: blogData.userId,
                image: blogData.image,
                tags: ["technology", "programming"],
                isPublished:true
            };

            console.log(sanitizedBlog);
            

            
            const createdBlog = await this.Repository.createBlog(sanitizedBlog);
            return createdBlog;

        } catch (error) {
            
            if (error instanceof Error) {
                throw new Error(`Blog creation failed: ${error.message}`);
            }
            throw new Error('Blog creation failed: Unknown error');
        }
    }
}