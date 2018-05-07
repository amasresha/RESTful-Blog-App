var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodoverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

var app = express();
var port = 4500;

//APP config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer);
app.use(methodoverride("_method")); // this is used for PUT and DELETE request

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

//CREATE ROUTE
app.post("/blogs", function(req, res) {
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
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
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });

});
app.listen(port, function() {
    console.log("Server is running");
});