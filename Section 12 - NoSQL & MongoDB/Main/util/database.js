const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongoConnect = (cb) => {
	MongoClient.connect(
		'mongodb+srv://eliad91:eliad1991@cluster0.n3tbe.mongodb.net/Cluster0?retryWrites=true&w=majority'
	)
		.then((client) => {
			cb(client);
		})
		.catch((err) => console.log(err));
};

module.exports = mongoConnect;
