import { IUser } from "../../entities/types/User";

export interface AuthRepositoryInterface {
    createUser(userData: IUser, hashedPassword: string): Promise<any | null>
    saveOtp(email: string, otp: string): Promise<any | null>
    getStoredOtp(email: string): Promise<any | null>
    deleteAllOtp(email: string): Promise<any | null>
    verifyUserdb(email: string): Promise<any | null>
    getUserbyEMail(email: string): Promise<any | null>
    updateOtp(email: string , otp:string): Promise<any | null>
    saveGoogleUser(userData:IUser): Promise<any | null>
};