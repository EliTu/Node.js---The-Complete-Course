import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

interface BackdropProps {
	open: boolean;
	onClick: () => void;
}

const Backdrop: React.FC<BackdropProps> = ({ open, onClick }) =>
	ReactDOM.createPortal(
		<div
			className={['backdrop', open ? 'open' : ''].join(' ')}
			onClick={onClick}
		/>,
		document.getElementById('backdrop-root')!
	);

export default Backdrop;
