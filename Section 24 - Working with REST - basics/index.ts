import express from 'express';
import bodyParser from 'body-parser';

import feedRouter from './routes/feedRoutes';

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json()); // use the .json method to parse body json data found on 'application/json' type of response

app.use('/feed', feedRouter); // any request that starts with '/feed' param will be forwarder to the router

app.listen(() => console.log(`Listening on port: ${PORT || 8080}`));
