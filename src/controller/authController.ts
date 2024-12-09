import { Request, Response, NextFunction } from "express"
import { AuthInterface } from "../domian/interfaces/usecases/authInterface";
import { AuthenticatedRequest } from "../framework/Middlewares/authMiddleware";
import { IBlog } from "../domian/entities/types/IBlog";

declare module 'express-serve-static-core' {
    interface Request {
        userId?: string;
    }
}


// Extend the AuthenticatedRequest to include multer's file property
interface MulterAuthRequest extends AuthenticatedRequest {
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
}


export class AuthController {
    constructor(private readonly interactor: AuthInterface) { }

    async register(req: Request, res: Response, next: NextFunction) {

        try {
            const { name, email } = req.body;
            console.log(req.body);
            const user = await this.interactor.registerUser(req.body);
            res.status(200).json({ success: true });
        } catch (error: any) {
            console.error(error.message);
            res.status(400).json(error.message);

        }
    }

    async verifyOtp(req: Request, res: Response, next: NextFunction) {
        try {

            console.log(req.body);

            const response = await this.interactor.verifyUser(req.body);
            res.status(200).json({ success: true, response });
        } catch (error: any) {
            console.error("errro", error.message);
            res.status(500).json(error.message);
        }
    }


    async userLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const response = await this.interactor.loginUser(email, password);
            res.status(200).json({ success: true, response })
        } catch (error: any) {
            res.status(500).json(error.message);
        }
    }

    async resendOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.query;
            const userEmail = email as string
            const user = await this.interactor.resendOtp(userEmail);

            res.status(200).json({ message: "resend Otp sended succesfully", user });
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }


    async googleAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.interactor.googleAuth(req.body)
            console.log('google auth resonse', response);

            res.status(200).json({ message: "google authentication success", response });
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    async createBlog(req: Request, res: Response, next: NextFunction) {
        try {

            const userId = req.userId;
            const { title, brief, content } = req.body;
            const image = req.file?.path;
            const data = await this.interactor.createBlog({ title, brief, content, userId, image });

            res.status(201).json({
                success: true,
                message: 'Blog created successfully',
                data
            });

        } catch (error) {
            console.log(error);
            res.status(400).json(error);
            next(error);

        }
    }

    async getBlogs(req: Request, res: Response, next: NextFunction) {

        try {
            const blogs = await this.interactor.getBlogs();
            res.status(200).json({ success: true, blogs })
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async getBlogDetails(req: Request, res: Response, next: NextFunction) {
        const blogId = req.query?.blogId as string;

        try {
            if (!blogId) throw new Error('No blogId provided');
            const blog = await this.interactor.getBlogDetails(blogId);
            res.status(200).json({ success: true, blog });
        } catch (error) {
            console.log(error);
            next(error);
        }

    }

    async updateBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const blogId = req.query.blogId as string;
            const { title, brief, content } = req.body;
            const image = req.file?.path;
            console.log("re", image, blogId);

            const blog = await this.interactor.editBlog(blogId, { title, brief, content, image });
            res.status(200).json({ success: true, blog })
        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async deleteBlog(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('herte');
            const blogId = req.query.blogId as string;
            const userId = req.userId as string;
            const data = await this.interactor.deleteBlog(blogId, userId);
            res.status(201).json({ success: true });
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}