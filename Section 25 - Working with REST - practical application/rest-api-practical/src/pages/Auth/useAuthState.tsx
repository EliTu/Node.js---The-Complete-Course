import { useState } from 'react';
import { required, length, email } from '../../util/validators';
import { AuthForm, AuthState } from './types';

export const useAuthState = () => {
	const [authState, setAuthState] = useState<AuthState>({
		prevAuthForm: {
			fields: {
				email: {
					value: '',
					valid: false,
					touched: false,
					validators: [required, email],
				},
				password: {
					value: '',
					valid: false,
					touched: false,
					validators: [required, length({ min: 5 })],
				},
				name: {
					value: '',
					valid: false,
					touched: false,
					validators: [required],
				},
			},
			formIsValid: false,
		},
	});

	const inputChangeHandler = (input: keyof AuthForm, value: string) => {
		setAuthState(({ prevAuthForm }) => {
			let isFieldValid = true;

			for (const validator of prevAuthForm.fields[input]!.validators) {
				isFieldValid = isFieldValid && validator(value);
			}

			const updatedForm = {
				...prevAuthForm,
				[input]: {
					...prevAuthForm.fields[input],
					valid: isFieldValid,
					value: value,
				},
			};

			let formIsValid = true;
			for (const inputName in updatedForm.fields) {
				const form = updatedForm.fields[inputName as keyof AuthForm]!;
				formIsValid = formIsValid && form.valid;
			}
			return {
				prevAuthForm: updatedForm,
				formIsValid: formIsValid,
			};
		});
	};

	const inputBlurHandler = (input: keyof AuthForm) => {
		setAuthState(({ prevAuthForm }) => {
			return {
				prevAuthForm: {
					...prevAuthForm,
					fields: {
						...prevAuthForm.fields,
						[input]: {
							...prevAuthForm.fields[input],
							touched: true,
						},
					},
				},
			};
		});
	};

	return { inputChangeHandler, inputBlurHandler, authState };
};
