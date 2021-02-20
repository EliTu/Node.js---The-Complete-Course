import ReactDOM from 'react-dom';

import Button from '../Button/Button';
import './Modal.css';

interface ModalProps {
	title: string;
	acceptEnabled: boolean;
	isLoading?: boolean;
	onAcceptModal: () => void;
	onCancelModal: () => void;
}

const Modal: React.FC<ModalProps> = ({
	acceptEnabled,
	isLoading,
	onAcceptModal,
	onCancelModal,
	title,
	children,
}) => {
	const modalRoot = document.getElementById('modal-root');
	return (
		modalRoot &&
		ReactDOM.createPortal(
			<div className='modal'>
				<header className='modal__header'>
					<h1>{title}</h1>
				</header>
				<div className='modal__content'>{children}</div>
				<div className='modal__actions'>
					<Button design='danger' mode='flat' onClick={onCancelModal}>
						Cancel
					</Button>
					<Button
						mode='raised'
						onClick={onAcceptModal}
						disabled={!acceptEnabled}
						loading={isLoading}
					>
						Accept
					</Button>
				</div>
			</div>,
			modalRoot
		)
	);
};

export default Modal;
