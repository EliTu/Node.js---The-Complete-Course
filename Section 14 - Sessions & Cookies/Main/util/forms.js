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
	authForm: [],
};

module.exports = appForms;
