import { Request, Response } from 'express';

export const getPageNotFound = (req: Request, res: Response) => {
	const { isLoggedIn } = req.session;
	res.status(404).render('error/404', {
		docTitle: 'Page not found!',
		path: '/error/404',
		isLoggedIn: isLoggedIn,
	});
};

export const get500ErrorPage = (req: Request, res: Response) => {
	const { isLoggedIn } = req.session;
	res.status(500).render('error/500', {
		docTitle: 'Something went wrong',
		path: '/error/500',
		isLoggedIn: isLoggedIn,
	});
};
