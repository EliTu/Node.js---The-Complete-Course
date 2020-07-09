const { getDb } = require('../util/database');
class Product {
	constructor(title, price, description, imageUrl) {
		(this.title = title),
			(this.price = price),
			(this.description = description),
			(this.imageUrl = !imageUrl
				? `https://loremflickr.com/320/240/taiwan?random=${
						Math.floor(Math.random() * (45 - 1)) + 1
				  }`
				: imageUrl);
	}

	async save() {
		const db = getDb();
		try {
			const res = await db.collection('products').insertOne(this);
			return res;
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = Product;
