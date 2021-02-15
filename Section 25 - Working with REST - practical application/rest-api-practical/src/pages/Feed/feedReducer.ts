import { Post } from './SinglePost/SinglePost';

const SET_STATUS = 'SET_STATUS';
const SET_POST_LOADING = 'SET_POST_LOADING';
const POSTS_LOAD_SUCCESS = 'POSTS_LOAD_SUCCESS';
const POSTS_LOAD_FAIL = 'POSTS_LOAD_FAIL';
const SET_POST_PAGE = 'SET_POST_PAGE';
const SET_EDITING_MODE = 'SET_EDITING_MODE';
const EDIT_POST = 'SET_POST_EDIT';
const POST_UPDATE_SUCCESS = 'POST_UPDATE_SUCCESS';
const POST_UPDATE_FAIL = 'POST_UPDATE_FAIL';
const SET_ERROR = 'SET_ERROR';
const NULL_ERROR = 'NULL_ERROR';

interface FeedState {
	isEditing: boolean;
	posts: Post[];
	totalPosts: number;
	editPost: Post;
	status: string;
	postPage: number;
	postsLoading: boolean;
	editLoading: boolean;
}

type Action = {
	type: typeof SET_STATUS;
	payload: { status: FeedState['status'] };
};

export const initialFeedState: FeedState = {
	isEditing: false,
	posts: [],
	totalPosts: 0,
	editPost: null,
	status: '',
	postPage: 1,
	postsLoading: true,
	editLoading: false,
};

export const feedReducer = (state: FeedState, action: Action): FeedState => {
	switch (action.type) {
		case SET_STATUS: {
			const { status } = action.payload;
			return { ...state, status };
		}

		default:
			break;
	}
};
