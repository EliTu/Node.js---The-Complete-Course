const express = require('express');
const path = require('path');

const app = express();

const mainRoute = require('./routes/index');
const usersRoute = require('./routes/users');
const pageNotFoundRoute = require('./routes/404');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', usersRoute);
app.use(mainRoute);
app.use(pageNotFoundRoute)

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Port: ${port}`);
})