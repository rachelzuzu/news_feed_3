var express = require('express');
var bodyParser = require('body-parser');
var pg = require("pg");
var methodOverride = require("method-override");

var app = express();

app.set('view engine', 'ejs');
//allows us to view the individual pages
app.use(bodyParser.urlencoded({extended: true}));
//takes information from the body of the 
//individual page we are GETting from

// // Set up method override to work with POST requests that have the parameter "_method=DELETE"
app.use(methodOverride('_method'));

// refactor connection and query code
var db = require("./models");

//add GET to show all articles
app.get('/articles', function(req,res) {
//find all the articles
	db.Article.findAll()
//render article index page/template with articleList as articles
    .then(function(articles){ 
//find all instances of article and assign them to articles
//displays a list of articles in the db
  	   res.render('articles/index', {articlesList: articles});
//then put inside articles; render articles in articles/index
//pass on articlesList from index.ejs to articles
	  });
// console.log("GET /articles");
});



//get route for new articles form
app.get('/articles/new', function(req,res) {
  res.render('articles/new');
});
//post route for creating new article
//use post bc creating new data


app.post('/articles', function(req,res) {
  var title=req.body.article.title;
  var author=req.body.article.author;
  var content=req.body.article.content;
//create variable
//all html input, aka title; to have in the body of your request
//use values used in the body of the form
//title:req.body.article.title, 
  db.Article.create({
    title:title, 
    author:author, 
    content:content, 
 })
//pass in these values in the body of our request
  	.then(function(article) {
  		res.redirect('/articles');
//grab all articles and render them on the page
  	});
});


//Add Get route for a specific article with an id
app.get('/articles/:id', function(req, res) {
//url param accessible in our route, coming in under our url
//finding a article by id
  var articleId = req.params.id;
//req is a made up id, what comes in under our url param
  db.Article.find(articleId) //find articleToDisplay??
  			 .then(function(article) {
  			  res.render('articles/show', {articleToDisplay:article});
  		});
//find articles/article in db, and then render articles/article template 
// with articlesList as articles
});



app.get('/articles/:id/edit', function(req, res) {
  var articleId = req.params.id;
  db.Article.find(articleId) 
         .then(function(article) {
          res.render('articles/edit', {article:article});
      });
});


//find the article with that id
app.put("/articles/:id", function (req, res) {s
  db.Article.find(req.params.id)
    .then(function (article) {
      article.updateAttributes({
        title:req.body.article.title, 
        content:req.body.article.content, 
        author:req.body.article.author
      })
      .then(function (article) {
//redirect to articles show page
          res.redirect("/articles/" + article.id);
      })
    })
});




//add delete
app.delete('/articles/:id', function(req,res) {
  //delete in runtime
  var id=req.params.id;
  db.Article.find(id)
            .then(function(article){
              article.destroy()
              //destroy in db
              .then(function() {
                res.redirect('/articles');
              });
            });
});


app.get('/', function(req,res) {
  res.render('site/index.ejs');
});

app.get('/about', function(req,res) {
  res.render('site/about');
});

app.get('/contact', function(req,res) {
  res.render('site/contact');
});




//listens to make sure that JS is running
app.listen(3000, function() {
  console.log('Listening');
});

//array of articles in articlesList, loop through and return 
//each article in that array
//from each article return title which links to show page and return content
