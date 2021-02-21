import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

interface BackdropProps {
	open: boolean;
	onClick: () => void;
}

const Backdrop: React.FC<BackdropProps> = ({ open, onClick }) => {
	const backdropRoot = document.getElementById('backdrop-root');
	return (
		backdropRoot &&
		ReactDOM.createPortal(
			<div
				className={['backdrop', open ? 'open' : ''].join(' ')}
				onClick={onClick}
			/>,
			backdropRoot
		)
	);
};

export default Backdrop;
