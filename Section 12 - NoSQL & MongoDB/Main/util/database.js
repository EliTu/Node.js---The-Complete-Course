const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
	MongoClient.connect(
		'mongodb+srv://eliad91:eliad1991@cluster0.n3tbe.mongodb.net/Cluster0?retryWrites=true&w=majority',
		{ useUnifiedTopology: true }
	)
		.then((client) => {
			_db = client.db();
			cb();
		})
		.catch((err) => console.log(err));
};

const getDb = () => {
	if (_db) return _db;
	else throw new Error('No Database available');
};

module.exports = {
	mongoConnect,
	getDb,
};
