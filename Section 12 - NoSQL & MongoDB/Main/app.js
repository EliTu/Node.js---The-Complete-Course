const express = require('express');
const path = require('path');
const parser = require('body-parser');

const app = express();

const User = require('./models/user');

const { mongoConnect } = require('./util/database');

// Set a template engine global value
app.set('view engine', 'pug');
app.set('views', 'views');

// Set body parser middleware
app.use(
	parser.urlencoded({
		extended: false,
	})
);

// Serve CSS files statically from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes import
const AdminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');

const { getPageNotFound } = require('./controllers/404');

app.use(async (req, res, next) => {
	const user = await User.findUserById('5f0cb0900778562c35d71825');

	req.user = new User(user.username, user.email, user.cart, user._id);
	next();
});

// app routes
app.use('/admin', AdminRoute);
app.use(shopRoute);

// 404 catch all route
app.use(getPageNotFound);

mongoConnect(async () => {
	try {
		const user = await User.findUserById('5f0cb0900778562c35d71825');
		if (user) {
			const port = process.env.PORT || 3000;
			app.listen(port, () => console.log(`Connected on port: ${port}`));
		} else {
			throw new Error('No user found!');
		}
	} catch (error) {
		console.log(error);
	}
});
