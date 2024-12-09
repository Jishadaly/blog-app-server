import express from 'express';

import { AthInteractorImpl } from '../../domian/usecase/authInteractor';
import { AuthController } from '../../controller/authController'
import { AuthRepositoryImpl } from '../../domian/repositories/authRepo';

const authRouter = express.Router();

const repository = new AuthRepositoryImpl();
const interactor = new AthInteractorImpl(repository);
const controller = new AuthController(interactor)

authRouter.post('/register',controller.register.bind(controller));
authRouter.post('/verifyOTP' , controller.verifyOtp.bind(controller));
authRouter.post('/login',controller.userLogin.bind(controller));
authRouter.get('/resendOtp',controller.resendOtp.bind(controller));
authRouter.post('/googleLogin',controller.googleAuth.bind(controller))

export default authRouter;