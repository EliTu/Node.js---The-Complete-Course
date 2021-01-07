// set a new error object to handle server errors that were caught by the catch block and pass the error object to next to let express handle errors
const setErrorMiddlewareObject = (error = 'Server error has ocurred', next) => {
	const errorObject = new Error(error);
	errorObject.httpStatusCode = 500;

	return next(errorObject);
};

module.exports = setErrorMiddlewareObject;
