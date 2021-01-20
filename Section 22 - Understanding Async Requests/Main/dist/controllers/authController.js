"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNewPassword = exports.postPasswordReset = exports.postLogout = exports.postSignup = exports.postLogin = exports.getNewPasswordPage = exports.getPasswordResetPage = exports.getSignupPage = exports.getLoginPage = exports.sendMail = void 0;
const crypto_1 = __importDefault(require("crypto")); // node-core module that can help generate random token
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const user_1 = __importDefault(require("../models/user"));
const setErrorMiddlewareObject_1 = __importDefault(require("../util/setErrorMiddlewareObject"));
const validations_1 = require("../util/validations");
const forms_1 = __importDefault(require("../util/forms"));
const email_templates_1 = __importDefault(require("../util/email-templates"));
const setUserMessage_1 = __importDefault(require("../util/setUserMessage"));
const { confirmationMail, passwordResetMail, passwordResetSuccess, } = email_templates_1.default;
const { authForm, signupForm, passwordResetForm, newPasswordForm } = forms_1.default;
/* AUTH UTILS */
// instantiate a MailTrap transporter with the MailTrap settings use it to send mails
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '948e8cb96b7e8a',
        pass: 'd133b389eaa602',
    },
});
const setLoginUserSession = (user, session) => {
    session.isLoggedIn = true;
    // save the mongoDB user to the session
    session.user = user;
    return session;
};
const setUserInitialName = (user) => user.email.split('@')[0];
const sendMail = (res, { to, subject, html }) => {
    transporter.sendMail({ to, from: 'shop@nodecomplete.com', subject, html, date: `${Date.now()}` }, (err, info) => {
        if (err) {
            console.error(err);
            res.redirect('/');
        }
        else {
            console.log(`Email has been successfully sent with the id ${info.messageId}`);
        }
    });
};
exports.sendMail = sendMail;
/* GET Controls */
const getLoginPage = (req, res) => {
    res.render('auth/login', {
        docTitle: 'Login',
        pageSubtitle: 'Enter details to log in',
        forms: authForm,
        path: '/login',
        error: setUserMessage_1.default(req.flash('error')),
        success: setUserMessage_1.default(req.flash('success')),
    });
};
exports.getLoginPage = getLoginPage;
const getSignupPage = (req, res) => {
    res.render('auth/signup', {
        docTitle: 'Signup',
        pageSubtitle: 'Signup for our shop to view and buy products',
        forms: signupForm,
        path: '/signup',
        error: setUserMessage_1.default(req.flash('error')),
    });
};
exports.getSignupPage = getSignupPage;
const getPasswordResetPage = (req, res) => {
    res.render('auth/reset-password', {
        docTitle: 'Password reset',
        pageSubtitle: 'Enter your email to reset your password',
        forms: passwordResetForm,
        path: '/reset-password',
        error: setUserMessage_1.default(req.flash('error')),
    });
};
exports.getPasswordResetPage = getPasswordResetPage;
const getNewPasswordPage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    try {
        const user = yield user_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiration: { $gt: `${Date.now()}` },
        });
        if (!user) {
            req.flash('error', 'Invalid password reset request. Please reset the password by following the link in the password reset email'); // flash an error message onto the session with the flash middleware
            return res.redirect('/');
        }
        res.render('auth/new-password', {
            docTitle: 'Password reset',
            pageSubtitle: 'Enter your your new password',
            forms: newPasswordForm,
            path: '/new-password',
            error: setUserMessage_1.default(req.flash('error')),
            userId: user._id.toString(),
            passwordToken: token,
        });
    }
    catch (error) {
        setErrorMiddlewareObject_1.default(error, next);
    }
});
exports.getNewPasswordPage = getNewPasswordPage;
/* POST CONTROLS */
const postLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const isFormInvalid = validations_1.checkForValidationErrors(req, res, 'auth/login', {
        docTitle: 'Login',
        pageSubtitle: 'Enter details to log in',
        forms: authForm,
        path: '/login',
        prevData: { email, password: '' },
        success: setUserMessage_1.default(req.flash('success')),
    });
    if (isFormInvalid)
        return;
    try {
        const user = yield user_1.default.findOne({ email: email });
        return setLoginUserSession(user, req.session).save((err) => {
            if (err) {
                setErrorMiddlewareObject_1.default(err, next);
            }
            const userInitialName = setUserInitialName(user);
            req.flash('success', `Welcome back, ${userInitialName}!`);
            return res.redirect('/');
        });
    }
    catch (error) {
        setErrorMiddlewareObject_1.default(error, next);
    }
});
exports.postLogin = postLogin;
const postSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const isFormInvalid = validations_1.checkForValidationErrors(req, res, 'auth/signup', {
        docTitle: 'Signup',
        pageSubtitle: 'Signup for our shop to view and buy products',
        forms: signupForm,
        path: '/signup',
        prevData: { email, password, confirm: req.body.confirm },
    });
    if (isFormInvalid)
        return;
    try {
        // encrypt the password to a hashed string form before storing
        const hashedPassword = yield bcrypt_1.default.hash(password, 12);
        const newUser = new user_1.default({
            email,
            password: hashedPassword,
            cart: { items: [] },
        });
        yield newUser.save();
        return setLoginUserSession(newUser, req.session).save((err) => {
            if (err) {
                setErrorMiddlewareObject_1.default(err, next);
            }
            const userInitialName = setUserInitialName(newUser);
            req.flash('success', `Welcome, ${userInitialName}! a confirmation mail has been sent to ${email}`);
            res.redirect('/'); // Redirect before sending the confirmation mail
            // use the transporter to send an email async
            return exports.sendMail(res, {
                to: email,
                subject: 'Signup succeeded!',
                html: confirmationMail,
            });
        });
    }
    catch (error) {
        setErrorMiddlewareObject_1.default(error, next);
    }
});
exports.postSignup = postSignup;
const postLogout = (req, res, next) => {
    try {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }
    catch (error) {
        setErrorMiddlewareObject_1.default(error, next);
    }
};
exports.postLogout = postLogout;
const postPasswordReset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email: userEmail } = req.body;
    // use the crypto module to generate random string with 32 bytes
    crypto_1.default.randomBytes(32, (err, buffer) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            req.flash('error', 'Something went wrong!');
            return res.redirect('/reset-password');
        }
        // generate a token from the buffer by converting it to string and passing hex to convert hexadecimal values
        const token = buffer.toString('hex');
        try {
            if (!userEmail) {
                req.flash('error', `Please enter a valid email into the email field!`);
                return res.redirect('/reset-password');
            }
            const user = yield user_1.default.findOne({ email: userEmail });
            if (!user) {
                req.flash('error', `No user found for ${userEmail}, please check your email`);
                return res.redirect('/reset-password');
            }
            user.resetPasswordToken = token;
            user.resetPasswordTokenExpiration = Date.now() + 8.64e7; // set expiration date to 24 hours from the request time
            yield user.save();
            req.flash('success', `a password reset email has been sent to ${userEmail}`);
            res.redirect('/');
            return exports.sendMail(res, {
                to: userEmail,
                subject: 'Reset password',
                html: passwordResetMail(token),
            });
        }
        catch (error) {
            setErrorMiddlewareObject_1.default(error, next);
        }
    }));
});
exports.postPasswordReset = postPasswordReset;
const postNewPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password: newPassword, userId, passwordToken, } = req.body;
    try {
        const user = yield user_1.default.findOne({
            _id: userId,
            resetPasswordToken: passwordToken,
            resetPasswordTokenExpiration: { $gt: Date.now() },
        });
        if (!user) {
            req.flash('error', 'Something went wrong, no user found!');
            return res.redirect('/');
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 12);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiration = undefined;
        yield user.save();
        req.flash('success', `Password reset successfully`);
        res.redirect('/login');
        return exports.sendMail(res, {
            to: user.email,
            subject: 'Password reset success',
            html: passwordResetSuccess,
        });
    }
    catch (error) {
        setErrorMiddlewareObject_1.default(error, next);
    }
});
exports.postNewPassword = postNewPassword;
//# sourceMappingURL=authController.js.map