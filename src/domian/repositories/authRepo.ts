
import { AuthRepositoryInterface } from "../interfaces/repositories/authInterfase";
import { IUser } from "../entities/types/User";
import { Users } from "../../framework/dbModel/user";
import OTP from "../../framework/dbModel/otp";
import { Encrypt } from "../helper/hashPassword";


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

    async deleteAllOtp(email: string): Promise<any | null > {
        return await OTP.deleteMany({ email: email });
    }

    async verifyUserdb  (email: string) : Promise<any | null > {
        const userData = await Users.findOneAndUpdate(
          { email: email },
          { $set: { verified: true } },
          { new: true }
        );
        return userData;
      }

      async getUserbyEMail  (email: string): Promise<any | null > {
        return await Users.findOne({ email: email })
      }

      async updateOtp (email: string, otp: string)  {
        return await OTP.findOneAndUpdate({ email }, { otp, createdAt: new Date() }, { upsert: true });
      }

      async saveGoogleUser  (userData: IUser)  {

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


}