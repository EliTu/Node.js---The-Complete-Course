import { Post as IPost } from '../../../pages/Feed/types';

import Button from '../../Button/Button';
import './Post.css';

interface PostProps extends IPost {
	onStartEdit: () => void;
	onDelete: () => void;
}

const Post: React.FC<PostProps> = ({
	author,
	content,
	date,
	_id,
	onDelete,
	onStartEdit,
	image,
	title,
}) => (
	<article className='post'>
		<header className='post__header'>
			<h3 className='post__meta'>
				Posted by {author} on {date}
			</h3>
			<h1 className='post__title'>{title}</h1>
		</header>
		{/* <div className="post__image">
      <Image imageUrl={image} contain />
    </div>
    <div className="post__content">{content}</div> */}
		<div className='post__actions'>
			<Button mode='flat' link={_id}>
				View
			</Button>
			<Button mode='flat' onClick={onStartEdit}>
				Edit
			</Button>
			<Button mode='flat' design='danger' onClick={onDelete}>
				Delete
			</Button>
		</div>
	</article>
);

export default Post;
