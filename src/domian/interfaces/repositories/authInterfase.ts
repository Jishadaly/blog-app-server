import { IBlog } from "../../../framework/dbModel/blog";
import { IUser } from "../../entities/types/User";
import { IBlog as IBlogBody } from "../../entities/types/IBlog";

export interface AuthRepositoryInterface {
    createUser(userData: IUser, hashedPassword: string): Promise<any | null>
    saveOtp(email: string, otp: string): Promise<any | null>
    getStoredOtp(email: string): Promise<any | null>
    deleteAllOtp(email: string): Promise<any | null>
    verifyUserdb(email: string): Promise<any | null>
    getUserbyEMail(email: string): Promise<any | null>
    updateOtp(email: string, otp: string): Promise<any | null>
    saveGoogleUser(userData: IUser): Promise<any | null>
    findBlogByTitle(title: string): Promise<IBlog | null>
    createBlog(blog: IBlogBody): Promise<any | null>
    getStoredBlogs(): Promise<IBlog[] | null>
    getBlogById(blogId: string): Promise<IBlog | null>
    updateBlogById(blogId: string, blogData: IBlogBody): Promise<IBlog | null>
    deleteBlogById(blogId: string): Promise<boolean | null>
};