const appForms = {
	setProductForm: [
		{
			name: 'title',
			type: 'text',
			title: 'Title',
			placeholder: "Enter the product's title",
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
		},
		{
			name: 'confirm',
			type: 'password',
			title: 'Confirm Password',
			placeholder: '',
		},
	],
};

module.exports = appForms;
