const fs = require('fs');
const path = require('path');

const filePath = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        fs.readFile(filePath, (err, content) => {
            let products = [];
            if (!err) products = JSON.parse(content);

            products.push(this);

            fs.writeFile(filePath, JSON.stringify(products), (e) => console.log(e));
        });
    }

    static fetchAll(callback) {
        fs.readFile(filePath, (err, content) => {
            if (err) callback([]);

            callback(JSON.parse(content));
        });
    }
}

module.exports = Product;