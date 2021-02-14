import React, { useState } from 'react';

import Input from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import { required, length, email } from '../../util/validators';
import Auth from './Auth';
import { AuthState, AuthForm } from './types';

interface LoginProps {
	onLogin: (event: React.SyntheticEvent, authData: any) => Promise<void>;
	loading: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, loading }) => {
	const [loginState, setLoginState] = useState<AuthState>({
		loginForm: {
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
			},
			formIsValid: false,
		},
	});

	const inputChangeHandler = (input: keyof AuthForm, value: string) => {
		setLoginState(({ loginForm }) => {
			let isFieldValid = true;

			for (const validator of loginForm.fields[input].validators) {
				isFieldValid = isFieldValid && validator(value);
			}

			const updatedForm = {
				...loginForm,
				[input]: {
					...loginForm.fields[input],
					valid: isFieldValid,
					value: value,
				},
			};

			let formIsValid = true;
			for (const inputName in updatedForm.fields) {
				const form = updatedForm.fields[inputName as keyof AuthForm];
				formIsValid = formIsValid && form.valid;
			}
			return {
				loginForm: updatedForm,
				formIsValid: formIsValid,
			};
		});
	};

	const inputBlurHandler = (input: keyof AuthForm) => {
		setLoginState(({ loginForm }) => {
			return {
				loginForm: {
					...loginForm,
					fields: {
						...loginForm.fields,
						[input]: {
							...loginForm.fields[input],
							touched: true,
						},
					},
				},
			};
		});
	};

	const { loginForm } = loginState;

	return (
		<Auth>
			<form
				onSubmit={(e) =>
					onLogin(e, {
						email: loginForm.fields.email.value,
						password: loginForm.fields.password.value,
					})
				}
			>
				<Input
					id='email'
					label='Your E-Mail'
					type='email'
					control='input'
					onChange={inputChangeHandler}
					onBlur={inputBlurHandler('email')}
					value={loginForm.fields['email'].value}
					valid={loginForm.fields['email'].valid}
					touched={loginForm.fields['email'].touched}
				/>
				<Input
					id='password'
					label='Password'
					type='password'
					control='input'
					onChange={inputChangeHandler}
					onBlur={inputBlurHandler('password')}
					value={loginForm.fields['password'].value}
					valid={loginForm.fields['password'].valid}
					touched={loginForm.fields['password'].touched}
				/>
				<Button design='raised' type='submit' loading={loading}>
					Login
				</Button>
			</form>
		</Auth>
	);
};

export default Login;
