const express = require('express');
const parser = require('body-parser');

const app = express();

app.set('view engine', 'pug');

app.use(
	parser.urlencoded({
		extended: false,
	})
);

const usersRoute = require('./routes/users');
const mainRoute = require('./routes/index');

app.use('/admin', usersRoute);
app.use(mainRoute.router)
app.use((req, res) => res.status(404).render('404', {
	pageTitle: 'Page not found!'
}));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Port: ${port}`));