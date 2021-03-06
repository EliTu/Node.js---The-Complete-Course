// Packages
const express = require('express');
const path = require('path');
const parser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongodbSessionStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

// Routes
const authRoutes = require('./routes/auth');
const AdminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');

// FIles
const { getPageNotFound } = require('./controllers/404');
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

// Set body parser middleware
app.use(
	parser.urlencoded({
		extended: false,
	})
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
		req.user = user;

		return next();
	} catch (error) {
		console.log(error);
	}
});

// Serve CSS files statically from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// set a middleware that will declare common local variables that will be available for every view that is being rendered
app.use((req, res, next) => {
	res.locals.isLoggedIn = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken(); // register a valid csrf token for every POST request

	next();
});

// app routes
app.use(authRoutes);
app.use('/admin', AdminRoute);
app.use(shopRoute);

// 404 catch all route
app.use(getPageNotFound);

mongoose
	.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => {
		const port = process.env.PORT || 3000;
		app.listen(port, () => console.log(`Connected on port: ${port}`));
	})
	.catch((err) => console.log(err));
