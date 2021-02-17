import React from 'react';
import './Input.css';

interface InputProps {
	control: 'input' | 'textarea';
	type?: 'text' | 'image' | 'email' | 'password' | 'number';
	id?: string;
	label?: string;
	valid?: boolean;
	touched?: boolean;
	value?: string;
	required?: boolean;
	placeholder?: string;
	rows?: number;
	onBlur?: () => void;
	onChange: (id: any, value: string, files?: FileList | null) => any;
}

const Input: React.FC<InputProps> = ({
	id,
	label,
	onBlur,
	onChange,
	touched,
	valid,
	type,
	control,
	placeholder,
	required,
	value,
	rows,
}) => {
	const generateInput = () => {
		const inputElement: React.InputHTMLAttributes<HTMLInputElement> =
			control === 'input' ? (
				<input
					id={id}
					className={[
						!valid ? 'invalid' : 'valid',
						touched ? 'touched' : 'untouched',
					].join(' ')}
					type={type}
					required={required}
					value={value}
					placeholder={placeholder}
					onChange={(e) => onChange(id, e.target.value, e.target.files)}
					onBlur={onBlur}
				/>
			) : (
				<textarea
					className={[
						!valid ? 'invalid' : 'valid',
						touched ? 'touched' : 'untouched',
					].join(' ')}
					id={id}
					rows={rows}
					required={required}
					value={value}
					onChange={(e) => onChange(id, e.target.value)}
					onBlur={onBlur}
				/>
			);

		return (
			<>
				{label && <label htmlFor={id}>{label}</label>}
				{inputElement}
			</>
		);
	};

	return <div className='input'>{generateInput()}</div>;
};

export default Input;
