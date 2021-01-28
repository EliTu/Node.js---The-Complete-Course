"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An object that contains all the data for various forms in the app, to be consumed in the view by the template engine to create form fields.
 */
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
            type: 'file',
            title: 'Product Image',
            placeholder: 'Upload an image of the product',
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
exports.default = appForms;
//# sourceMappingURL=forms.js.map