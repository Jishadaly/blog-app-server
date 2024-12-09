import { IBlog } from "../../../framework/dbModel/blog";
import { IUser } from "../../entities/types/User";
import { IBlog as IBlogBody } from "../../entities/types/IBlog";

export interface AuthInterface {
    registerUser(userData: IUser): Promise<any>
    verifyUser(data: { otp: string, email: string }): Promise<any>
    loginUser(email: string, password: string): Promise<any>
    resendOtp(email: string): Promise<any>
    googleAuth(userData: IUser): Promise<any>
    createBlog(blogData: IBlogBody): Promise<any>
    getBlogs(): Promise<IBlog[] | null>
}