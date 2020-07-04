const express = require('express');
const path = require('path');
const parser = require('body-parser');

const app = express();

const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

// Set a template engine global value
app.set('view engine', 'pug');
app.set('views', 'views');

// Set body parser middleware
app.use(
	parser.urlencoded({
		extended: false,
	})
);

// Serve CSS files statically from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes import
const AdminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');

const { getPageNotFound } = require('./controllers/404');

app.use(async (req, res, next) => {
	try {
		const user = await User.findByPk(1);
		req.user = user;

		next();
	} catch (error) {
		console.log(error);
	}
});

// app routes
app.use('/admin', AdminRoute);
app.use(shopRoute);

// 404 catch all route
app.use(getPageNotFound);

// Sequelize tables associations:
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
	.sync()
	.then(() => User.findByPk(1))
	.then((user) => {
		if (!user) {
			User.create({ name: 'Durden', email: 'ddd@tt.com' });
		}
		return user;
	})
	.then((user) => user.createCart())
	.then(() => {
		// server setup and port
		const port = process.env.PORT || 3000;
		app.listen(port, () => console.log(`Connected on port: ${port}`));
	})
	.catch((e) => console.log(e));
