var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
var port = 3500;

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
Blog.create({
    title: "Test Blog",
    image: "https://www.stockfreeimages.com/Stock-Market-Chart-thumb36641746.jpg",
    body: "Hello this first blog"
});

app.listen(port, function() {
    console.log("Server is running");
});