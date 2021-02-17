export interface FormField {
	value: string;
	valid: boolean;
	touched: boolean;
	validators: ((value: string) => boolean)[];
}

export interface AuthForm {
	email: FormField;
	password: FormField;
	name?: FormField;
}

export interface AuthState {
	prevAuthForm: {
		fields: AuthForm;
		formIsValid: boolean;
	};
}
