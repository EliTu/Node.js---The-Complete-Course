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

    save() {
        const saveFile = products => {
            products.push(this);
            fs.writeFile(filePath, JSON.stringify(products), (e) => console.log(e));
        }
        getProductsFromFIle(saveFile);
    }

    static fetchAll(fetchProducts) {
        getProductsFromFIle(fetchProducts)
    }
}
module.exports = Product;