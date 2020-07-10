const express = require('express');
const path = require('path');
const parser = require('body-parser');

const app = express();

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

// app routes
app.use('/admin', AdminRoute);
app.use(shopRoute);

// 404 catch all route
app.use(getPageNotFound);

mongoConnect(() => {
	const port = process.env.PORT || 3000;
	app.listen(port, () => console.log(`Connected on port: ${port}`));
});
