import Backdrop from '../Backdrop/Backdrop';
import Modal from '../Modal/Modal';

interface ErrorHandlerProps {
	error: any;
	onHandle: () => void;
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({ error, onHandle }) => (
	<>
		{error && <Backdrop open={error} onClick={onHandle} />}
		{error && (
			<Modal
				title='An Error Occurred'
				onCancelModal={onHandle}
				onAcceptModal={onHandle}
				acceptEnabled
			>
				<p>{error.message}</p>
			</Modal>
		)}
	</>
);

export default ErrorHandler;
