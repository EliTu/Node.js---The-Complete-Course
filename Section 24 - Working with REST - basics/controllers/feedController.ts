import { RequestHandler } from 'express';

export const getPosts: RequestHandler = (req, res, next) => {
	res.status(200).json({
		posts: [{ title: 'First Post', content: 'This is my first post' }],
	});
};

export const postPost: RequestHandler = (req, res, next) => {
	const { title, content } = req.body;
	res.status(201).json({
		message: 'Post created successfully!',
		post: { id: new Date().toISOString(), title, content },
	});
};
