 const Product = require('../models/product');
 const forms = [{
         name: "title",
         type: "text",
         title: "Title",
         placeholder: "Enter the product's title"
     },
     {
         name: "imageUrl",
         type: "url",
         title: "Image URL",
         placeholder: "Enter product image URL"
     },
     {
         name: "price",
         type: "number",
         title: "Price",
         placeholder: "Enter product's price"
     },
     {
         name: "description",
         type: "textarea",
         title: "Description",
         placeholder: "Enter a brief description of the product"
     },
 ];

 // Specific for '/admin/...':
 const getAddProduct = (_, res) => {
     res.render("admin/add-product", {
         docTitle: "Add Product",
         pageSubtitle: 'Add a product',
         forms: forms,
         path: "/admin/add-product",
         hasForms: forms.length,
         formsActive: true,
         formsCSS: true,
     });
 }

 const postNewProduct = (req, res) => {
     const {
         title,
         description,
         price,
         imageUrl
     } = req.body;

     const product = new Product(title,
         imageUrl,
         price,
         description);
     product.saveProduct();

     res.redirect("/products");
 }

 const getAdminProduct = (_, res) => {
     const fetchCallback = products => {
         res.render('admin/admin-products', {
             docTitle: 'Admin Products',
             pageSubtitle: 'Products in store',
             path: '/admin/admin-products',
             products: products
         })
     }
     Product.fetchAll(fetchCallback);

 }

 module.exports = {
     getAddProduct,
     postNewProduct,
     getAdminProduct
 }