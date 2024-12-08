
import { AuthInterface } from "../interfaces/usecases/authInterface";
import { AuthRepositoryInterface } from "../interfaces/repositories/authInterfase";
import { IUser } from "../entities/types/User";
import { Encrypt } from "../helper/hashPassword";
import { otpGeneratorFun } from "../utils/otpGenerator";
import { generateOtpEmailContent } from "../../utils/mailerContentGen";
import sendMail from "../helper/sendMail";
import { generateToken } from "../helper/jwtHelper";

export class AthInteractorImpl implements AuthInterface {

    constructor(private readonly Repository: AuthRepositoryInterface) { }

    async registerUser(userData: IUser): Promise<any> {
        console.log('dattaaaaaa',userData);
        
        try {
            if (!userData.password) {
                throw new Error("Password is required.");
            }
            const hashedPassword =  Encrypt.cryptPassword(userData.password);
            const savedUser = await this.Repository.createUser(userData, hashedPassword);
            if (savedUser) {
                const otp = otpGeneratorFun();
                console.log("OTP : " ,otp);
                
                await this.Repository.saveOtp(savedUser.email, otp);
                const emailContent =  generateOtpEmailContent(savedUser.userName, otp);
                sendMail(savedUser.email, emailContent);
             } else {
                throw Error( "User registration failed" );
             }

            return savedUser;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async verifyUser( data: { otp: string, email: string }): Promise<any> {
        
        try {
            const otpRecord = await this.Repository.getStoredOtp(data.email)
        
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
     
     async loginUser (email: string, password: string) : Promise<any> {
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
            return { accessToken };
        } catch (error: any) {
            throw error
        }
    }
}