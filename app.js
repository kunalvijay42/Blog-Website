require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Welcome to the Daily Journal website, here you can post any content anonymously. your secrets or your thoughts about society or anything are safe with us, feel free to login and use our website. ";
const aboutContent = "I am a Web Developer. I work on NodeJs & ExpressJs for backend, MongoDB for database, HTML-CSS for frontend, and multiple NodeJs modules like Mongoose, Lodash, ejs, etc. ";
const contactContent = "You can contact through kunalvijay.kv2002@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

//console.log(process.env.USERNAMEE);
//console.log(process.env.PASSWORD)

mongoose.connect("mongodb+srv://" + process.env.USERNAMEE + ":" + process.env.PASSWORD + "@cluster0.0mx8qku.mongodb.net/blogDB", { useNewUrlParser: true });

//mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({}, function(err, posts){       //find is used for reading the data in the DB 
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
    });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
 
  });
  res.redirect("/");
});

app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  
    Post.findOne({_id: requestedPostId}, function(err, post){    //output gets saved in post variable 
      res.render("post", {
        title: post.title,      //post has the result in form of title and content which we then assign to the variables 
        content: post.content
      });
    });
  
  });
    //const storedTitle = _.lowerCase(post.title);

    //if (storedTitle === requestedTitle) {
      //res.render("post", {
        //title: post.title,
        //content: post.content
      //});
    //}
  //});

//});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port);