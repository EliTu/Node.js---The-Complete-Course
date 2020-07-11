const { getDb } = require('../util/database');
const mongodb = require('mongodb');
class User {
	constructor(username, email) {
		this.username = username;
		this.email = email;
	}

	save() {
		const db = getDb();
		const res = db.collection('users').insertOne(this);
		return res;
	}

	static findUserById(userId) {
		const db = getDb();

		const res = db
			.collection('users')
			.findOne({ _id: new mongodb.ObjectId(userId) });
		return res;
	}
}

module.exports = User;
