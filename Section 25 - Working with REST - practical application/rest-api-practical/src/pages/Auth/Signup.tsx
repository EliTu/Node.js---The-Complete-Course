import React from 'react';
import { useAuthState } from './useAuthState';

import { AuthState } from './types';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import Auth from './Auth';

interface SignupProps {
	onSignup: (
		event: React.FormEvent<HTMLFormElement>,
		state: AuthState
	) => Promise<void>;
	loading: boolean;
}

const Signup: React.FC<SignupProps> = ({ onSignup, loading }) => {
	const { authState, inputBlurHandler, inputChangeHandler } = useAuthState();
	const { prevAuthForm: authForm } = authState;

	return (
		<Auth>
			<form onSubmit={(e) => onSignup(e, authState)}>
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
					id='name'
					label='Your Name'
					type='text'
					control='input'
					onChange={inputChangeHandler}
					onBlur={() => inputBlurHandler('name')}
					value={authForm.fields['name']!.value}
					valid={authForm.fields['name']!.valid}
					touched={authForm.fields['name']!.touched}
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
					Signup
				</Button>
			</form>
		</Auth>
	);
};

export default Signup;
