import { UserModel } from '../models/user';

declare module 'express' {
	export interface Request {
		user?: UserModel;
	}
}

declare module 'express-session' {
	export interface SessionData {
		user: UserModel;
		isLoggedIn: boolean;
	}
}
