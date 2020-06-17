const fs = require('fs');
const path = require('path');

const filePath = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductsFromFIle = callback => {
    fs.readFile(filePath, (err, content) => {
        if (err) return callback([]);
        else return callback(JSON.parse(content));
    });
}

class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        getProductsFromFIle(products => {
            products.push(this);
            fs.writeFile(filePath, JSON.stringify(products), (e) => console.log(e));
        });
    }

    static fetchAll(callback) {
        getProductsFromFIle(callback)
    }
}
module.exports = Product;