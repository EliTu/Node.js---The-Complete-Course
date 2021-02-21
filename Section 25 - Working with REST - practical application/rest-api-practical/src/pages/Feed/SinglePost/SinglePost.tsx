import { useState, useEffect, useCallback } from 'react';

import Image from '../../../components/Image/Image';
import { Post, SinglePostProps } from '../types';
import './SinglePost.css';

const SinglePost: React.FC<SinglePostProps> = ({ match }) => {
	const [postState, setPostState] = useState<Post>({
		_id: '',
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
				_id: data.post._id,
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
				{image && <Image isContain imageUrl={image} />}
			</div>
			<p>{content}</p>
		</section>
	);
};

export default SinglePost;
