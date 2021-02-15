import React, { useState, useEffect, useCallback } from 'react';
import { match } from 'react-router';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

interface SinglePostProps {
	userId: string;
	token: string;
	match: match<Record<'postId', string>>;
}

export interface Post {
	title: string;
	author: string;
	date: string;
	content: string;
	image?: string;
}

const SinglePost: React.FC<SinglePostProps> = ({ match }) => {
	const [postState, setPostState] = useState<Post>({
		title: '',
		author: '',
		date: '',
		content: '',
		image: '',
	});

	const getPostData = useCallback(async () => {
		const postId = match.params.postId;
		try {
			const res = await fetch('URL');

			if (res.status !== 200) {
				throw new Error('Failed to fetch status');
			}
			const data = await res.json();

			setPostState({
				title: data.post.title,
				author: data.post.creator.name,
				date: new Date(data.post.createdAt).toLocaleDateString('en-US'),
				content: data.post.content,
			});
		} catch (error) {
			console.log(error);
		}
	}, [match.params.postId]);

	useEffect(() => {
		getPostData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const { author, content, date, image, title } = postState;

	return (
		<section className='single-post'>
			<h1>{title}</h1>
			<h2>
				Created by {author} on {date}
			</h2>
			<div className='single-post__image'>
				<Image contain imageUrl={image} />
			</div>
			<p>{content}</p>
		</section>
	);
};

export default SinglePost;
