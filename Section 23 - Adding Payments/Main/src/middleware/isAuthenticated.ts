import { Request, Response, NextFunction } from 'express';
/**
 * A simple middleware for route protection that will first check if the requesting user is logged in (authenticated),
 * if not, he will be redirected to log in first. If authenticated, call next to go to the next middleware.
 * @param {*} req The Express req object.
 * @param {*} res The Express res object.
 * @param {*} next The Express next middleware.
 */
const isAuthenticated = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (!req.session.isLoggedIn) {
		return res.redirect('/login');
	}
	next();
};

export default isAuthenticated;
