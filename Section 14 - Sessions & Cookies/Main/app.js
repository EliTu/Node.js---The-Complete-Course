const express = require('express');
const path = require('path');
const parser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

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
	})
);
// Serve CSS files statically from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes import
const authRoutes = require('./routes/auth');
const AdminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');

const { getPageNotFound } = require('./controllers/404');

app.use(async (req, res, next) => {
	const user = await User.findById('5f15f27574eaee3599a8d0de');

	req.user = user;
	next();
});

// app routes
app.use(authRoutes);
app.use('/admin', AdminRoute);
app.use(shopRoute);

// 404 catch all route
app.use(getPageNotFound);
mongoose
	.connect(
		'mongodb+srv://eliad91:eliad1991@cluster0.n3tbe.mongodb.net/Cluster0?retryWrites=true&w=majority',
		{ useUnifiedTopology: true, useNewUrlParser: true }
	)
	.then(async () => {
		let user = await User.findOne();
		if (!user) {
			user = new User({
				name: 'Eliad',
				email: 'e@e.com',
				cart: {
					items: [],
				},
			});
			user.save();
		}
		const port = process.env.PORT || 3000;
		app.listen(port, () => console.log(`Connected on port: ${port}`));
	})
	.catch((err) => console.log(error));
