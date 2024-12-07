import { IUser } from "../../entities/types/User";

export interface AuthInterface {
    registerUser(userData: IUser): Promise<any>
    verifyUser(data: { otp: string, email: string }): Promise<any>
    loginUser(email: string, password: string): Promise<any>
}