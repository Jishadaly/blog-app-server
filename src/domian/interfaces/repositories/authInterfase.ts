import { IUser } from "../../entities/types/User";

export interface AuthRepositoryInterface {
    createUser(userData:IUser, hashedPassword:string):Promise<any | null>
    saveOtp(email:string , otp:string):Promise<any | null>

};