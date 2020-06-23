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
    constructor(title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = !imageUrl ? `https://loremflickr.com/320/240/product?random=${Math.floor(Math.random() * (45 - 1)) + 1}` : imageUrl;
        this.price = price;
        this.description = description;
    }

    saveProduct() {
        this.id = Math.random().toString();
        const saveFileCallback = products => {
            products.push(this);
            fs.writeFile(filePath, JSON.stringify(products), (e) => console.log(e));
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
}

module.exports = Product;