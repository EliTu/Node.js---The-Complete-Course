// Packages
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import parser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
const mongodbSessionStore = require('connect-mongodb-session')(session);
import csrf from 'csurf';
import flash from 'connect-flash';
import multer, { FileFilterCallback, Multer } from 'multer';

// Routes
import authRoutes from './routes/auth';
import AdminRoute from './routes/admin';
import shopRoute from './routes/shop';
import errorRoutes from './routes/error';

// Files
import { getPageNotFound } from './controllers/errorController';
import User from './models/user';

const MONGODB_URI =
	'mongodb+srv://eliad91:Et@081991@cluster0.n3tbe.mongodb.net/Cluster0?retryWrites=true&w=majority';

const app = express();
const store = new mongodbSessionStore({
	uri: MONGODB_URI,
	collection: 'sessions',
});
// init CSRF token service with csurf
const csrfProtection = csrf();

// set a multer storage engine to handle file storage on the memory by setting destination folder and file names
const fileStorage = multer.diskStorage({
	destination: (
		req: Request,
		file: Express.Multer.File,
		cb: (error: Error | null, destination: string) => void
	) => {
		// call the cb function and pass null for error to indicate operation success and set a destination folder
		cb(null, './assets/images');
	},
	filename: (req, file, cb) => {
		// call the cb function and set a unique file name by combining the filenames with a unique string
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});
// set a storage file filter validation function to pass it to multer in order to filter files based on file mimetype property
const multerFilter = (
	req: Request,
	file: Express.Multer.File,
	cb: FileFilterCallback
) => {
	// call the cb function with true to accept and store the file, or false to deny the file
	const [, imageType] = file.mimetype.split('/');
	if (
		imageType === 'png' ||
		imageType === 'jpg' ||
		imageType === 'jpeg' ||
		imageType === 'gif'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

// Set a template engine global value
app.set('view engine', 'pug');
app.set('views', 'views');

// Set body parser middleware to parse plain text requests (like forms)
app.use(
	parser.urlencoded({
		extended: false,
	})
);

// set multer middleware to scan for enctype=multipart requests (files. images etc) and parse them correctly, use the fileStorage as the engine, and fileFilter for validation
app.use(
	multer({ storage: fileStorage, fileFilter: multerFilter }).single('imageUrl')
);

// Register a session middleware
app.use(
	session({
		secret: 'this is a secret',
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

// register the CSRF protection as a middleware
app.use(csrfProtection);

// init the connect-flash as a middleware to flash (store and then remove) data in sessions (must be init only after init the session)
app.use(flash());

// set the mongoose user document found in the DB by looking up the userId in the session
app.use(async (req, res, next) => {
	if (!req.session.user) return next();
	try {
		const user = await User.findById(req.session.user);
		if (!user) next();

		req.user = user;
		return next();
	} catch (error) {
		throw new Error(error);
	}
});

// serve CSS files statically from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// serve the image files statically
app.use(
	'/assets/images',
	express.static(path.join(__dirname, './assets/images'))
);

// set a middleware that will declare common local variables that will be available for every req/res and is passable to any view that is being rendered
app.use((req, res, next) => {
	res.locals.isLoggedIn = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken(); // register a valid csrf token for every POST request

	next();
});

// shop/admin routes
app.use(authRoutes);
app.use('/admin', AdminRoute);
app.use(shopRoute);

// error routes
app.use(errorRoutes);

// 404 catch all middleware
app.use(getPageNotFound);

// define an error handling middleware (defined by setting error as first argument) to let express handle incoming errors (by calling next with an error object)
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
	// render the 500 error page when this middleware is reached
	return res.status(500).render('error/500', {
		docTitle: 'Something went wrong',
		path: '/error/500',
		isLoggedIn: req.session.isLoggedIn,
		error,
	});
});

mongoose
	.connect(MONGODB_URI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useFindAndModify: false,
	})
	.then(() => {
		const port = process.env.PORT || 3000;
		app.listen(port, () => console.log(`Connected on port: ${port}`));
	})
	.catch((err: Error) => console.log(err));
