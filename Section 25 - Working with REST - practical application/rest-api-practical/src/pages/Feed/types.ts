import { match } from 'react-router';

export interface FeedProps {
	userId: string;
	token: string;
}

export interface SinglePostProps {
	userId: string;
	token: string;
	match: match<Record<'postId', string>>;
}

export interface Post {
	_id: string;
	title: string;
	author: string;
	date: string;
	content: string;
	image?: string;
}
