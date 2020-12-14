const appForms = {
	setProductForm: [
		{
			name: 'title',
			type: 'text',
			title: 'Title',
			placeholder: "Enter the product's title",
			min: 4,
			max: 25,
		},
		{
			name: 'imageUrl',
			type: 'url',
			title: 'Image URL',
			placeholder: 'Enter product image URL',
		},
		{
			name: 'price',
			type: 'number',
			title: 'Price',
			placeholder: "Enter product's price",
		},
		{
			name: 'description',
			type: 'textarea',
			title: 'Description',
			placeholder: 'Enter a brief description of the product',
			min: 0,
			max: 500,
		},
	],
	authForm: [
		{
			name: 'email',
			type: 'email',
			title: 'Email',
			placeholder: 'Please enter the your email',
		},
		{
			name: 'password',
			type: 'password',
			title: 'Password',
			placeholder: 'Please enter your password',
			min: 4,
			max: 12,
		},
	],
	signupForm: [
		{
			name: 'email',
			type: 'email',
			title: 'Email',
			placeholder: 'Please enter the your email',
		},
		{
			name: 'password',
			type: 'password',
			title: 'Password',
			placeholder: '',
			min: 4,
			max: 12,
		},
		{
			name: 'confirm',
			type: 'password',
			title: 'Confirm Password',
			placeholder: '',
			min: 4,
			max: 12,
		},
	],
	passwordResetForm: [
		{
			name: 'email',
			type: 'email',
			title: 'Email',
			placeholder: 'Please enter the your email',
		},
	],
	newPasswordForm: [
		{
			name: 'password',
			type: 'password',
			title: 'Password',
			placeholder: '',
			min: 4,
			max: 12,
		},
		{
			name: 'confirm',
			type: 'password',
			title: 'Confirm Password',
			placeholder: '',
			min: 4,
			max: 12,
		},
	],
};

module.exports = appForms;
