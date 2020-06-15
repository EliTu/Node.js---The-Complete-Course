const express = require("express");
const path = require("path");
const parser = require("body-parser");
// const expressHbs = require("express-handlebars");

const app = express();

// Use express-handlebars as a custom templating engine
// app.engine(
//     "hbs",
//     expressHbs({
//         layoutsDir: "views/layouts/",
//         defaultLayout: "main",
//         extname: "hbs",
//     })
// );

// Set a template engine global value
app.set("view engine", "ejs");
app.set("views", "views");

// Set body parser middleware
app.use(
    parser.urlencoded({
        extended: false,
    })
);

// Serve CSS files statically from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Routes import
const adminData = require("./routes/admin");
const shopRoute = require("./routes/shop");

// app routes
app.use("/admin", adminData.route);
app.use(shopRoute);

// 404 catch all route
app.use((req, res) => {
    res.status(404).render("404", {
        docTitle: "Page not found!",
    });
});

// server setup and port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Connected on port: ${port}`);
});