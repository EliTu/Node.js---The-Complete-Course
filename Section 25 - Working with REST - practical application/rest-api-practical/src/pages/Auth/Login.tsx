import React from 'react';
import { useAuthState } from './useAuthState';

import Input from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import Auth from './Auth';

interface LoginProps {
	onLogin: (
		event: React.FormEvent<HTMLFormElement>,
		authData: Record<'email' | 'password', string>
	) => Promise<void>;
	loading: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, loading }) => {
	const { authState, inputBlurHandler, inputChangeHandler } = useAuthState();
	const { prevAuthForm: authForm } = authState;

	return (
		<Auth>
			<form
				onSubmit={(e) =>
					onLogin(e, {
						email: authForm.fields.email.value,
						password: authForm.fields.password.value,
					})
				}
			>
				<Input
					id='email'
					label='Your E-Mail'
					type='email'
					control='input'
					onChange={inputChangeHandler}
					onBlur={() => inputBlurHandler('email')}
					value={authForm.fields['email'].value}
					valid={authForm.fields['email'].valid}
					touched={authForm.fields['email'].touched}
				/>
				<Input
					id='password'
					label='Password'
					type='password'
					control='input'
					onChange={inputChangeHandler}
					onBlur={() => inputBlurHandler('password')}
					value={authForm.fields['password'].value}
					valid={authForm.fields['password'].valid}
					touched={authForm.fields['password'].touched}
				/>
				<Button design='raised' type='submit' loading={loading}>
					Login
				</Button>
			</form>
		</Auth>
	);
};

export default Login;
