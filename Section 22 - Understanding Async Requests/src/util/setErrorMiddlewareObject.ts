import { NextFunction } from 'express';

interface MiddlewareError extends Error {
	message: string;
	name: string;
	httpsCode?: number;
	stack?: string;
}

/**
 * Set a new error object to handle server errors that were caught by the catch block and pass it to let express handle errors in the Express catch all errors middleware.
 * @param error The error object or string that was produced when the error has occurred.
 * @param next The Express package next method that will forward to the next middleware.
 */
const setErrorMiddlewareObject = (
	error = 'Server error has ocurred',
	next: NextFunction
) => {
	// TODO: WORK ON THE ERROR OBJECT AND 500 VIEW PAGE
	const errorObject = new Error(error) as MiddlewareError;
	errorObject.httpsCode = 500;

	return next(errorObject);
};

export default setErrorMiddlewareObject;
