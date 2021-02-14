interface FormField {
	value: string;
	valid: boolean;
	touched: boolean;
	validators: ((value: string) => boolean)[];
}

export interface AuthForm {
	email: FormField;
	password: FormField;
}

export interface AuthState {
	loginForm: {
		fields: AuthForm;
		formIsValid: boolean;
	};
}
