import Image from './Image';
import './Avatar.css';

interface AvatarProps {
	size: number;
	image: string;
}

const Avatar: React.FC<AvatarProps> = ({ image, size }) => (
	<div className='avatar' style={{ width: size + 'rem', height: size + 'rem' }}>
		<Image imageUrl={image} />
	</div>
);

export default Avatar;
