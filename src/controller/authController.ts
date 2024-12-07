import { Request, Response, NextFunction } from "express"
import { AuthInterface } from "../domian/interfaces/usecases/authInterface";

export class AuthController {
    constructor(private readonly interactor: AuthInterface) { }

    async register(req: Request, res: Response , next: NextFunction) {
        try {
            const { name, email } = req.body;
            console.log(req.body);
            const user = await this.interactor.registerUser(req.body);
            res.status(200).json({ message: "user created successfully"});
         } catch (error: any) {
            console.error(error.message);
            res.status(400).json( error.message );
         }
    }
}