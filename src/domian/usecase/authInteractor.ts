
import { AuthInterface } from "../interfaces/usecases/authInterface";
import { AuthRepositoryInterface } from "../interfaces/repositories/authInterfase";
import { IUser } from "../entities/types/User";
import { Encrypt } from "../helper/hashPassword";
import { otpGeneratorFun } from "../utils/otpGenerator";
import { generateOtpEmailContent } from "../../utils/mailerContentGen";
import sendMail from "../helper/sendMail";

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
                const emailContent = await generateOtpEmailContent(savedUser.userName, otp);
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
}