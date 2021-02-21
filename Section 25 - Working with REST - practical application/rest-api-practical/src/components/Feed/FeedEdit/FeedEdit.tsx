import { useState, useEffect } from 'react';
import Backdrop from '../../Backdrop/Backdrop';
import Modal from '../../Modal/Modal';
import Input from '../../Form/Input/Input';
import Image from '../../Image/Image';
import { required, length } from '../../../util/validators';
import { generateBase64FromImage } from '../../../util/image';
import { FormField } from '../../../pages/Auth/types';
import { Post } from '../../../pages/Feed/types';

interface FeedEditProps {
	editing: boolean;
	selectedPost: Post;
	loading: boolean;
	onCancelEdit: () => void;
	onFinishEdit: (post: Partial<Post>) => void;
}

interface EditState {
	postForm: Record<'title' | 'image' | 'content', FormField>;
	formIsValid: boolean;
	imagePreview: any;
}

const POST_FORM: EditState['postForm'] = {
	title: {
		value: '',
		valid: false,
		touched: false,
		validators: [required, length({ min: 5 })],
	},
	image: {
		value: '',
		valid: false,
		touched: false,
		validators: [required],
	},
	content: {
		value: '',
		valid: false,
		touched: false,
		validators: [required, length({ min: 5 })],
	},
};

const FeedEdit: React.FC<FeedEditProps> = ({
	editing,
	loading,
	selectedPost,
	onCancelEdit,
	onFinishEdit,
}) => {
	const [editState, setEditState] = useState<EditState>({
		postForm: POST_FORM,
		formIsValid: false,
		imagePreview: null,
	});

	useEffect(() => {
		if (editing && selectedPost) {
			const { title, image, content } = editState.postForm;
			const updatedPostForm = {
				title: {
					...title,
					value: selectedPost.title,
					valid: true,
				},
				image: {
					...image,
					value: selectedPost.image || '',
					valid: true,
				},
				content: {
					...content,
					value: selectedPost.content,
					valid: true,
				},
			};

			setEditState({
				...editState,
				postForm: updatedPostForm,
				formIsValid: true,
			});
		}
	}, [editState, editing, selectedPost]);

	const postInputChangeHandler = async (
		input: keyof EditState['postForm'],
		value: string,
		files: FileList | null | undefined
	) => {
		if (files) {
			try {
				const b64 = await generateBase64FromImage(files[0]);
				if (b64) {
					setEditState({ ...editState, imagePreview: b64 });
				}
			} catch (error) {
				setEditState({ ...editState, imagePreview: null });
			}
		}

		setEditState((prevState) => {
			let isValid = true;
			for (const validator of prevState.postForm[input].validators) {
				isValid = isValid && validator(value);
			}
			const updatedForm: EditState['postForm'] = {
				...prevState.postForm,
				[input]: {
					...prevState.postForm[input],
					valid: isValid,
					value: files ? files[0] : value,
				},
			};
			let formIsValid = true;
			for (const inputName in updatedForm) {
				formIsValid =
					formIsValid &&
					updatedForm[inputName as keyof EditState['postForm']].valid;
			}

			return {
				...prevState,
				postForm: updatedForm,
				formIsValid: formIsValid,
			};
		});
	};

	const inputBlurHandler = (input: keyof EditState['postForm']) => {
		setEditState((prevState) => {
			return {
				...editState,
				postForm: {
					...prevState.postForm,
					[input]: {
						...prevState.postForm[input],
						touched: true,
					},
				},
			};
		});
	};

	const cancelPostChangeHandler = () => {
		setEditState({
			...editState,
			postForm: POST_FORM,
			formIsValid: false,
		});
		onCancelEdit();
	};

	const acceptPostChangeHandler = () => {
		const { postForm } = editState;
		const post: Partial<Post> = {
			title: postForm.title.value,
			image: postForm.image.value,
			content: postForm.content.value,
		};
		onFinishEdit(post);

		setEditState({
			postForm: POST_FORM,
			formIsValid: false,
			imagePreview: null,
		});
	};

	const { postForm, formIsValid, imagePreview } = editState;

	return editing ? (
		<>
			<Backdrop open={editing} onClick={cancelPostChangeHandler} />
			<Modal
				title='New Post'
				acceptEnabled={formIsValid}
				onCancelModal={cancelPostChangeHandler}
				onAcceptModal={acceptPostChangeHandler}
				isLoading={loading}
			>
				<form>
					<Input
						id='title'
						label='Title'
						control='input'
						type='text'
						onChange={postInputChangeHandler}
						onBlur={() => inputBlurHandler('title')}
						valid={postForm['title'].valid}
						touched={postForm['title'].touched}
						value={postForm['title'].value}
					/>
					<Input
						id='image'
						label='Image'
						control='input'
						type='image'
						onChange={postInputChangeHandler}
						onBlur={() => inputBlurHandler('image')}
						valid={postForm['image'].valid}
						touched={postForm['image'].touched}
					/>
					<div className='new-post__preview-image'>
						{!imagePreview && <p>Please choose an image.</p>}
						{imagePreview && <Image imageUrl={imagePreview} isContain isLeft />}
					</div>
					<Input
						id='content'
						label='Content'
						control='textarea'
						rows={5}
						onChange={postInputChangeHandler}
						onBlur={() => inputBlurHandler('content')}
						valid={postForm['content'].valid}
						touched={postForm['content'].touched}
						value={postForm['content'].value}
					/>
				</form>
			</Modal>
		</>
	) : null;
};

export default FeedEdit;
