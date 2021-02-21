import express from 'express';

import { getPosts, postPost } from '../controllers/feedController';

const feedRouter = express.Router();

// handle GET requests for '/feed/*'
feedRouter.get('/posts', getPosts); // GET /feed/posts

// handle POST requests for '/feed/*'
feedRouter.post('/post', postPost); // POST /feed/post

export default feedRouter;
