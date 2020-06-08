const express = require('express');

const app = express();

app.use('/users', (req, res, next) => {
    console.log('Users middleware');
    res.send('<h1>Users page</h1>')
});

app.use('/', (req, res, next) => {
    console.log('Catch all middleware');
    res.send('<h1>Welcome to Express app</h1>')
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Connected on port: ${port}`);
    
})