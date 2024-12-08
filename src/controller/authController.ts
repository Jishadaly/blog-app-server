import { Request, Response, NextFunction } from "express"
import { AuthInterface } from "../domian/interfaces/usecases/authInterface";

export class AuthController {
    constructor(private readonly interactor: AuthInterface) { }

    async register(req: Request, res: Response, next: NextFunction) {
        console.log(this.interactor);
        
        try {
            const { name, email } = req.body;
            console.log(req.body);
            const user = await this.interactor.registerUser(req.body);
            res.status(200).json({ message: "user created successfully" });
        } catch (error: any) {
            console.error(error.message);
            res.status(400).json(error.message);
        }
    }

    async verifyOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.interactor.verifyUser(req.body);
            res.status(200).json({ message: "verify success", response });
        } catch (error: any) {
            console.error("errro", error.message);
            res.status(500).json(error.message);
        }
    }


    async userLogin(req: Request, res: Response, next: NextFunction) {
        try {

            const { email, password } = req.body
            const response = await this.interactor.loginUser(email, password);
            res.status(200).json({ message: "user login success", response })
        } catch (error: any) {
            res.status(500).json(error.message);
        }
    }


}