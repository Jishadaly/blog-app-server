import { IUser } from "../../entities/types/User";

export interface AuthInterface {
    registerUser(userData:IUser): Promise<any>
}