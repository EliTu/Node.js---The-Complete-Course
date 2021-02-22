import { useReducer, useEffect, useCallback, memo } from 'react';
import {
	feedReducer,
	initialFeedState,
	nullEditPostState,
} from './feedReducer';

import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';
import { Post as IPost, FeedProps } from './types';

const Feed: React.FC<FeedProps> = memo(({ userId, token }) => {
	const [state, dispatch] = useReducer(feedReducer, initialFeedState);
	const {
		isEditing,
		posts,
		totalPosts,
		editPost,
		status,
		postPage,
		postsLoading,
		editLoading,
		error,
	} = state;

	const errorCatcher = (error: any) => {
		dispatch({ type: 'SET_ERROR', payload: { error } });
	};

	const statusInputChangeHandler = (input: any, value: string) => {
		dispatch({ type: 'SET_STATUS', payload: { status: value } });
	};

	const newPostHandler = () => {
		dispatch({ type: 'SET_EDITING_MODE' });
	};
	console.log(state);

	const startEditPostHandler = (postId: string) => {
		const editPost: IPost =
			posts.find((p) => p._id === postId) || nullEditPostState;
		dispatch({ type: 'SET_POST_EDIT', payload: { editPost } });
	};

	const cancelEditHandler = () => {
		dispatch({ type: 'SET_EDITING_MODE' });
	};

	const loadPosts = useCallback(
		async (direction?: 'next' | 'previous') => {
			if (direction) {
				dispatch({ type: 'SET_POST_LOADING' });
			}

			let page = postPage;
			direction === 'next'
				? dispatch({ type: 'SET_POST_PAGE', payload: { postPage: ++page } })
				: dispatch({ type: 'SET_POST_PAGE', payload: { postPage: --page } });

			try {
				const loadPostsRes = await fetch('http://localhost:8080/feed/posts');
				if (loadPostsRes.status !== 200) {
					throw new Error('Failed to fetch posts.');
				}
				const postsData = await loadPostsRes.json();
				dispatch({
					type: 'POSTS_LOAD_SUCCESS',
					payload: { posts: postsData.posts, totalPosts: postsData.totalItems },
				});
			} catch (error) {
				errorCatcher(error);
			}
		},
		[postPage]
	);

	const fetchUserStatus = useCallback(async () => {
		try {
			const userStatusRes = await fetch('URL');
			if (userStatusRes.status !== 200) {
				throw new Error('Failed to fetch user status.');
			}
			const userStatusData = await userStatusRes.json();

			dispatch({
				type: 'SET_STATUS',
				payload: { status: userStatusData.status },
			});
		} catch (error) {
			errorCatcher(error);
		} finally {
			loadPosts();
		}
	}, [loadPosts]);

	useEffect(() => {
		fetchUserStatus();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const statusUpdateHandler = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		try {
			const statusUpdateRes = await fetch('URL');
			if (statusUpdateRes.status !== 200 && statusUpdateRes.status !== 201) {
				throw new Error("Can't update status!");
			}
			const statusUpdateData = await statusUpdateRes.json();
			console.log(statusUpdateData);
		} catch (error) {
			errorCatcher(error);
		}
	};

	const finishEditHandler = async (postData: any) => {
		dispatch({ type: 'SET_EDITING_MODE' });

		// Set up data (with image!)
		let url = 'URL';
		if (editPost) {
			url = 'URL';
		}

		try {
			const editPostRes = await fetch(url);
			if (editPostRes.status !== 200 && editPostRes.status !== 201) {
				throw new Error('Creating or editing a post failed!');
			}
			const editPostData = await editPostRes.json();

			const post: IPost = {
				_id: editPostData.post._id,
				title: editPostData.post.title,
				content: editPostData.post.content,
				author: editPostData.post.author,
				date: editPostData.post.date,
			};

			let updatedPosts = [...posts];
			if (editPost) {
				const postIndex = posts.findIndex((p) => p._id === editPost._id);
				updatedPosts[postIndex] = post;
			} else if (posts.length < 2) {
				updatedPosts = posts.concat(post);
			}

			dispatch({ type: 'POST_UPDATE_SUCCESS', payload: { posts } });
		} catch (error) {
			console.log(error);
			errorCatcher(error);
		}
	};

	const deletePostHandler = async (postId: string) => {
		dispatch({ type: 'SET_POST_LOADING' });

		try {
			const deletePostRes = await fetch('URL');
			if (deletePostRes.status !== 200 && deletePostRes.status !== 201) {
				throw new Error('Deleting a post failed!');
			}
			const deletePostData = await deletePostRes.json();
			console.log(deletePostData);

			const updatedPosts = posts.filter((p) => p._id !== postId);
			dispatch({
				type: 'POST_UPDATE_SUCCESS',
				payload: { posts: updatedPosts },
			});
		} catch (error) {
			console.log(error);
			errorCatcher(error);
		}
	};

	const errorHandler = () => {
		dispatch({ type: 'NULL_ERROR' });
	};

	return (
		<>
			<ErrorHandler error={state.error} onHandle={errorHandler} />
			<FeedEdit
				editing={isEditing}
				selectedPost={editPost}
				loading={editLoading}
				onCancelEdit={cancelEditHandler}
				onFinishEdit={finishEditHandler}
			/>
			<section className='feed__status'>
				<form onSubmit={statusUpdateHandler}>
					<Input
						type='text'
						placeholder='Your status'
						control='input'
						onChange={statusInputChangeHandler}
						value={status}
					/>
					<Button mode='flat' type='submit'>
						Update
					</Button>
				</form>
			</section>
			<section className='feed__control'>
				<Button mode='raised' design='accent' onClick={newPostHandler}>
					New Post
				</Button>
			</section>
			<section className='feed'>
				{postsLoading && (
					<div style={{ textAlign: 'center', marginTop: '2rem' }}>
						<Loader />
					</div>
				)}
				{posts.length <= 0 && !postsLoading ? (
					<p style={{ textAlign: 'center' }}>No posts found.</p>
				) : null}
				{!postsLoading && (
					<Paginator
						onPrevious={() => loadPosts('previous')}
						onNext={() => loadPosts('next')}
						lastPage={Math.ceil(totalPosts / 2)}
						currentPage={postPage}
					>
						{posts.map((post) => (
							<Post
								key={post._id}
								_id={post._id}
								author={post.author}
								date={new Date(post.date).toLocaleDateString('en-US')}
								title={post.title}
								image={post.image}
								content={post.content}
								onStartEdit={() => startEditPostHandler(post._id)}
								onDelete={() => deletePostHandler(post._id)}
							/>
						))}
					</Paginator>
				)}
			</section>
		</>
	);
});

export default Feed;
