require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Welcome to BlogMuse, A Blog website, here you can post any content anonymously. Your secrets or your thoughts about society or anything are safe with us, feel free to use our website. ";
const contactContent = "You can contact us through ";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));


mongoose.connect("mongodb+srv://" + process.env.USERNAMEE + ":" + process.env.PASSWORD + "@cluster0.0mx8qku.mongodb.net/blogDB", { useNewUrlParser: true });

// mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {       //find is used for reading the data in the DB 
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {

  if (req.body.postTitle == "" || req.body.postBody == "") {
    res.status(400).json({ error: 'Input field cannot be empty' });
  }
  else {
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody
    });
    post.save(function (err) {
      if (!err) {
        res.redirect("/");
      }
      else {
        console.log(err);
      }

    });
  }
});
app.get("/posts/:postId", function (req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {    //output gets saved in post variable 
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

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);