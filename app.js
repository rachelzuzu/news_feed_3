var express = require('express');
var bodyParser = require('body-parser');
var pg = require("pg");

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// Refactor connection and query code
var db = require("./models");

//add GET
// app.get('/classmates', function(req,res) {
//   db.Classmate.all().then(function(mates){
//   	//pulling data from cs table and then show all 'mates'
//   res.render('classmates', {peers: mates});
//   })
// });
app.get('/articles', function(req,res) {
	db.Article.findAll().then(function(articles){//find all instances of article and assign them to articles
		res.render('articles/index', {articlesList: articles});
	//then put inside articles; render articles in articles/index
	});
// console.log("GET /articles");
});

//--------
// Exercise 2:
// Part 1: Get route for the new Classmate form
// app.get('/classmates/new', function(req,res) {

//   res.render('new');
// });

// Part 2: Post route for creating a new Classmate
//using post bc creating new data
// app.post('/classmates', function(req,res) {
//   var name=req.body.first_name;
// //create variable
// //all html input, aka first name; to have in the body of your request
// //use values used in the body of the form
//   var age=req.body.age;

//   db.Classmate.create({first_name: name, age:age})
// //pass in these values in the body of our request
//     .then(function(mate) {
//       res.redirect('/classmates');
// //grab all classmates and render them on the page
//     });
// });
//-------

//get route for new articles form
app.get('/articles/new', function(req,res) {
  res.render('articles/new');
});
//post route for creating new article
app.post('/articles', function(req,res) {
  var title=req.body.title;
  var author=req.body.author;
  var content=req.body.content;
  var fiction=req.body.fiction;

  db.Article.create({title:title, author:author, content:content, fiction:fiction})
  	.then(function(articles) {
  		res.redirect('/articles');
  	});
});


// -------
// // Exercise 3: Add Get route for a specific Classmate
// // with an id
// app.get('/classmates/:id', function(req,res) {
// //url param accessible in our route, coming in under our url
// //finding a classmate by id
//   var id=req.params.id;
//  //req is a made up id, what comes in under our url param
//   db.Classmate.find(id) //find mate
//         .then(function(buddy) {
//           res.render('classmate', {mate: buddy,id: id});
//         });
//         //find classmate in db, and then render classmate template with mate as buddy and mateid, the id that came under our url
// });
// --------

//get by id
app.get('/articles/:id', function(req, res) {
  var articleId = req.params.id;
  db.Article.find(articleId)
  			 .then(function(articles) {
  			  res.render('articles/article', {articlesList:articles});
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

app.listen(3000, function() {
  console.log('Listening');
});


//array of articles in articleList, loop through and return 
//each article in that array
//from each article return title which links to show page and return content
