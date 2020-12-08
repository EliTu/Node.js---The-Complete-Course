const express = require('express');
const path = require('path');
const parser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongodbSessionStore = require('connect-mongodb-session')(session);

const MONGODB_URI =
	'mongodb+srv://eliad91:Et@081991@cluster0.n3tbe.mongodb.net/Cluster0?retryWrites=true&w=majority';

const app = express();
const store = new mongodbSessionStore({
	uri: MONGODB_URI,
	collection: 'sessions',
});

const User = require('./models/user');

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

// Routes import
const authRoutes = require('./routes/auth');
const AdminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');

const { getPageNotFound } = require('./controllers/404');

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
