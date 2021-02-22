import { RequestHandler } from 'express';

export const getPosts: RequestHandler = (req, res, next) => {
	const dummyPost = {
		_id: '123',
		creator: {
			name: 'Test',
		},
		content: ' Test content',
		createdAt: new Date().toISOString(),
		title: 'WOOOO',
		image: '../assets/images/shoe.jpeg',
	};

	res.status(200).json({
		posts: [dummyPost],
	});
};

export const postPost: RequestHandler = (req, res, next) => {
	const { title, content } = req.body;

	res.status(201).json({
		message: 'Post created successfully!',
		post: {},
	});
};
