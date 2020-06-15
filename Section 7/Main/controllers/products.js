 const products = [];
 const forms = [{
     name: "title",
     type: "text",
     title: "Title",
 }, ];

 // Specific for '/admin/...':
 const getAddProduct = (req, res) => {
     res.render("add-product", {
         docTitle: "Add Product",
         forms: forms,
         path: "/admin/add-product",
         hasForms: forms.length,
         formsActive: true,
         formsCSS: true,
     });
 }

 const postNewProduct = (req, res) => {
     console.log(req.body);

     products.push({
         title: req.body.title,
     });

     res.redirect("/");
 }

 //  Specific for '/':
 const getAllProducts = (req, res) => {
     res.render("shop", {
         products: products,
         docTitle: "Shop",
         path: "/admin/shop",
         hasProducts: products.length,
         productsActive: true,
         productCSS: true,
     });
 }

 module.exports = {
     getAddProduct,
     postNewProduct,
     getAllProducts
 }