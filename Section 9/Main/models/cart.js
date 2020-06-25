const fs = require('fs');
const path = require('path');

const filePath = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

class Cart {
    static addProduct(productId, productPrice) {
        fs.readFile(filePath, (error, existingCartContent) => {
            // Fetch previous cart
            let cart = {
                products: [],
                totalPrice: 0
            };

            if (!error) cart = JSON.parse(existingCartContent);

            // Analyze the cart => find an existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === productId);
            const existingProduct = cart.products[existingProductIndex];

            let updatedProduct;
            // If a product already exists, set an updated product with a new quantity
            if (existingProduct) {
                updatedProduct = {
                    ...existingProduct
                };
                updatedProduct.quantity = updatedProduct.quantity + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                // If it does not exist set a new product with the received id
                updatedProduct = {
                    id: productId,
                    quantity: 1
                }
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(filePath, JSON.stringify(cart), error => console.log(error));
        })
    }
}

module.exports = Cart;