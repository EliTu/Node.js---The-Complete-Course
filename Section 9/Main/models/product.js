const fs = require('fs');
const path = require('path');

const filePath = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductsFromFIle = action => {
    fs.readFile(filePath, (err, content) => {
        if (err) return action([]);
        else return action(JSON.parse(content));
    });
}

class Product {
    constructor(title, imageUrl, price, description, id) {
        this.title = title;
        this.imageUrl = !imageUrl ? `https://loremflickr.com/320/240/product?random=${Math.floor(Math.random() * (45 - 1)) + 1}` : imageUrl;
        this.price = price;
        this.description = description;
        this.id = id;
    }

    saveProduct() {
        const saveFileCallback = products => {
            if (this.id) {
                // If id exists, that means we're editing product
                const productIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProductsArray = [...products];
                updatedProductsArray[productIndex] = this;

                fs.writeFile(filePath, JSON.stringify(updatedProductsArray), e => console.log(e));
            } else {
                // If id is null then we add a new product
                this.id = Math.random().toString();
                products.push(this);

                fs.writeFile(filePath, JSON.stringify(products), e => console.log(e));
            }
        }
        getProductsFromFIle(saveFileCallback);
    }

    static fetchAll(fetchProductsCallback) {
        getProductsFromFIle(fetchProductsCallback)
    }

    static findProductById(id, fetchProductCallback) {
        getProductsFromFIle(products => {
            const product = products.find(product => product.id === id);
            fetchProductCallback(product);
        })
    }

    static deleteProduct(id) {
        const deleteProductCallback = products => {
            const updatedProductList = products.filter(product => product.id !== id);

            fs.writeFile(filePath, JSON.stringify(updatedProductList), e => {
                if (!e) {

                }
            });
        };
        getProductsFromFIle(deleteProductCallback);
    }
}

module.exports = Product;