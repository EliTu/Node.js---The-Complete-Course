// Packages
const express = require('express');
const path = require('path');
const parser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongodbSessionStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

// Routes
const authRoutes = require('./routes/auth');
const AdminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');
const errorRoutes = require('./routes/error');

// FIles
const { getPageNotFound } = require('./controllers/errorController');
const User = require('./models/user');

const MONGODB_URI =
	'mongodb+srv://eliad91:Et@081991@cluster0.n3tbe.mongodb.net/Cluster0?retryWrites=true&w=majority';

const app = express();
const store = new mongodbSessionStore({
	uri: MONGODB_URI,
	collection: 'sessions',
});
// init CSRF token service with csurf
const csrfProtection = csrf();

// Set a template engine global value
app.set('view engine', 'pug');
app.set('views', 'views');

// Set body parser middleware to parse plain text requests (like forms)
app.use(
	parser.urlencoded({
		extended: false,
	})
);

// set multer middleware to scan for enctype=multipart requests (files. images etc) and parse them correctly
app.use(multer({ dest: 'images' }).single('image'));

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

// Serve CSS files statically from the public folder
app.use(express.static(path.join(__dirname, 'public')));

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
app.use((error, req, res, next) => {
	console.error(error);
	// render the 500 error page when this middleware is reached
	return res.status(500).render('error/500', {
		docTitle: 'Something went wrong',
		path: '/error/500',
		isLoggedIn: req.session.isLoggedIn,
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
	.catch((err) => console.log(err));
