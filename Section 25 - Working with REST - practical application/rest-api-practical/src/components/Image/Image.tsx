import './Image.css';

interface ImageProps {
	imageUrl: string;
	isContain: boolean;
	isLeft: boolean;
}

const Image: React.FC<ImageProps> = ({ isContain, imageUrl, isLeft }) => (
	<div
		className='image'
		style={{
			backgroundImage: `url('${imageUrl}')`,
			backgroundSize: isContain ? 'contain' : 'cover',
			backgroundPosition: isLeft ? 'left' : 'center',
		}}
	/>
);

export default Image;
