import { Link } from 'react-router-dom';

import './Button.css';

interface ButtonProps {
	design: string;
	mode: string;
	link: string;
	disabled: boolean;
	type: 'button' | 'submit' | 'reset' | undefined;
	loading: boolean;
	onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
	design,
	disabled,
	link,
	loading,
	mode,
	onClick,
	type,
	children,
}) =>
	!link ? (
		<button
			className={['button', `button--${design}`, `button--${mode}`].join(' ')}
			onClick={onClick}
			disabled={disabled || loading}
			type={type}
		>
			{loading ? 'Loading...' : children}
		</button>
	) : (
		<Link
			className={['button', `button--${design}`, `button--${mode}`].join(' ')}
			to={link}
		>
			{children}
		</Link>
	);

export default Button;
