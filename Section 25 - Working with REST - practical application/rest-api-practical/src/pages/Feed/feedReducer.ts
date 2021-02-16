import { Post } from './SinglePost/SinglePost';

const SET_STATUS = 'SET_STATUS';
const SET_POST_LOADING = 'SET_POST_LOADING';
const POSTS_LOAD_SUCCESS = 'POSTS_LOAD_SUCCESS';
const SET_POST_PAGE = 'SET_POST_PAGE';
const SET_EDITING_MODE = 'SET_EDITING_MODE';
const EDIT_POST = 'SET_POST_EDIT';
const POST_UPDATE_SUCCESS = 'POST_UPDATE_SUCCESS';
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
	error: any;
}

type Action =
	| {
			type: typeof SET_STATUS;
			payload: { status: FeedState['status'] };
	  }
	| { type: typeof SET_POST_LOADING }
	| {
			type: typeof SET_POST_PAGE;
			payload: { postPage: FeedState['postPage'] };
	  }
	| {
			type: typeof POSTS_LOAD_SUCCESS;
			payload: {
				posts: FeedState['posts'];
				totalPosts: FeedState['totalPosts'];
			};
	  }
	| { type: typeof SET_EDITING_MODE }
	| { type: typeof EDIT_POST; payload: { editPost: FeedState['editPost'] } }
	| { type: typeof POST_UPDATE_SUCCESS; payload: { posts: FeedState['posts'] } }
	| { type: typeof SET_ERROR; payload: { error: FeedState['error'] } }
	| { type: typeof NULL_ERROR };

export const nullEditPostState: Post = {
	_id: '',
	author: '',
	content: '',
	date: '',
	title: '',
	image: '',
};

export const initialFeedState: FeedState = {
	isEditing: false,
	posts: [],
	totalPosts: 0,
	editPost: nullEditPostState,
	status: '',
	postPage: 1,
	postsLoading: true,
	editLoading: false,
	error: null,
};

export const feedReducer = (state: FeedState, action: Action): FeedState => {
	switch (action.type) {
		case SET_STATUS: {
			const { status } = action.payload;
			return { ...state, status };
		}

		case SET_POST_LOADING: {
			return { ...state, postsLoading: true, posts: [] };
		}

		case SET_POST_PAGE: {
			const { postPage } = action.payload;
			return { ...state, postPage };
		}

		case POSTS_LOAD_SUCCESS: {
			const { posts, totalPosts } = action.payload;
			return { ...state, posts, totalPosts, postsLoading: false };
		}

		case SET_EDITING_MODE: {
			return {
				...state,
				isEditing: !state.isEditing,
				editPost: Object.values(state.editPost).some((values) => values.length)
					? state.editPost
					: nullEditPostState,
			};
		}

		case EDIT_POST: {
			const { editPost } = action.payload;
			return { ...state, editPost, isEditing: true };
		}

		case POST_UPDATE_SUCCESS: {
			const { posts } = action.payload;
			return {
				...state,
				posts,
				isEditing: false,
				editPost: nullEditPostState,
				editLoading: false,
				postsLoading: false,
			};
		}

		case SET_ERROR: {
			const { error } = action.payload;
			return {
				...state,
				error,
				isEditing: false,
				editLoading: false,
				postsLoading: false,
				editPost: nullEditPostState,
			};
		}

		case NULL_ERROR: {
			return { ...state, error: null };
		}

		default:
			return state;
	}
};
