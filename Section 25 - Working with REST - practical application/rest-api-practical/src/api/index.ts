import express from 'express';
import bodyParser from 'body-parser';

import feedRouter from './routes/feedRoutes';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json()); // use the .json method to parse body json data found on 'application/json' type of response

// set headers for any response to solve CORS issues when giving other origins access to our API
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*'); // specifies access to all origins
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, PATCH, DELETE'
	); // specifies access to selected http methods
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // specifies access to modify headers
	next();
});

app.use('/feed', feedRouter); // any request that starts with '/feed' param will be forwarder to the router

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
