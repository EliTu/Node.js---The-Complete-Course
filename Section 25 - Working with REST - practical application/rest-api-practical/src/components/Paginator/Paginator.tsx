import './Paginator.css';

interface PaginatorProps {
	currentPage: number;
	lastPage: number;
	onPrevious: () => void;
	onNext: () => void;
}

const Paginator: React.FC<PaginatorProps> = ({
	currentPage,
	lastPage,
	onNext,
	onPrevious,
	children,
}) => (
	<div className='paginator'>
		{children}
		<div className='paginator__controls'>
			{currentPage > 1 && (
				<button className='paginator__control' onClick={onPrevious}>
					Previous
				</button>
			)}
			{currentPage < lastPage && (
				<button className='paginator__control' onClick={onNext}>
					Next
				</button>
			)}
		</div>
	</div>
);

export default Paginator;
