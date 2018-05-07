var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
var port = 4500;

//APP config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//mongoose/model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES
// Blog.create({
//     title: "Stock Blogs",
//     image: "https://www.stockfreeimages.com/Stock-Market-Chart-thumb36641746.jpg",
//     body: "stocks chart"
// });

//Routing

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log("Error");
        } else {
            res.render("index", { blogs: blogs });
        }
    });

});

//NEW ROUTE
//CREATE NEW ROUTE

app.get("/blogs/new", function(req, res) {
    res.render("new");
});

app.post("/blogs", function(req, res) {
    //create blog
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
    //redirect
});

//SHOW
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
});

//EDIT ROUTE
app.get("./blogs/:id/edit", function(req, res) {
    res.render("edit");
});
app.listen(port, function() {
    console.log("Server is running");
});