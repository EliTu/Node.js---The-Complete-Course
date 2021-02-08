import express from 'express';

import { getPosts } from '../controllers/feedController';

const feedRouter = express.Router();

// handle requests for '/feed/*'
const getPostsRouter = feedRouter.get('/posts', getPosts); // GET /feed/posts

export default feedRouter;
