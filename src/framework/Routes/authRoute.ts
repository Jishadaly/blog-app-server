import express from 'express';

import { AthInteractorImpl } from '../../domian/usecase/authInteractor';
import { AuthController } from '../../controller/authController'
import { AuthRepositoryImpl } from '../../domian/repositories/authRepo';

const authRouter = express.Router();

const repository = new AuthRepositoryImpl();
const interactor = new AthInteractorImpl(repository);
const controller = new AuthController(interactor)

authRouter.post('/register',controller.register.bind(controller));

export default authRouter;