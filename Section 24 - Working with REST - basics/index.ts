import express from 'express';

import feedRouter from './routes/feedRoutes';

const PORT = process.env.PORT;
const app = express();

app.use('/feed', feedRouter); // any request that starts with '/feed' param will be forwarder to the router

app.listen(PORT || 8080);
