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
    constructor(title) {
        this.title = title;
    }

    saveProduct() {
        const saveFileCallback = products => {
            products.push(this);
            fs.writeFile(filePath, JSON.stringify(products), (e) => console.log(e));
        }
        getProductsFromFIle(saveFileCallback);
    }

    static fetchAll(fetchProductsCallback) {
        getProductsFromFIle(fetchProductsCallback)
    }
}
module.exports = Product;