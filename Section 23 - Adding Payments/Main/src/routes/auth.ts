import express from 'express';

import { signupValidations, loginValidations } from '../util/validations';
import {
	getLoginPage,
	getSignupPage,
	getPasswordResetPage,
	getNewPasswordPage,
	postLogin,
	postLogout,
	postSignup,
	postPasswordReset,
	postNewPassword,
} from '../controllers/authController';

const router = express.Router();

router.get('/login', getLoginPage);
router.get('/signup', getSignupPage);
router.get('/reset-password', getPasswordResetPage);
router.get('/new-password/:token', getNewPasswordPage);

router.post('/login', loginValidations, postLogin);
router.post('/logout', postLogout);
router.post('/signup', signupValidations, postSignup);
router.post('/reset-password', postPasswordReset);
router.post('/new-password', postNewPassword);

export default router;
