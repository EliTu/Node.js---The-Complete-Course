const express = require("express");
const path = require("path");
const parser = require("body-parser");

const app = express();

// Set a template engine global value
app.set("view engine", "pug");
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
const AdminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");

// app routes
app.use("/admin", AdminRoute);
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