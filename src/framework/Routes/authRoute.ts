import express from 'express';

import { AthInteractorImpl } from '../../domian/usecase/authInteractor';
import { AuthController } from '../../controller/authController'
import { AuthRepositoryImpl } from '../../domian/repositories/authRepo';
import protect from '../Middlewares/authMiddleware';

const parser = require('../Middlewares/imageUpload')
const authRouter = express.Router();

const repository = new AuthRepositoryImpl();
const interactor = new AthInteractorImpl(repository);
const controller = new AuthController(interactor)

authRouter.post('/register',controller.register.bind(controller));
authRouter.post('/verifyOTP' , controller.verifyOtp.bind(controller));
authRouter.post('/login',controller.userLogin.bind(controller));
authRouter.get('/resendOtp',controller.resendOtp.bind(controller));
authRouter.post('/googleLogin',controller.googleAuth.bind(controller))

authRouter.post('/createBlog', protect, parser.single("image"),controller.createBlog.bind(controller));

export default authRouter;