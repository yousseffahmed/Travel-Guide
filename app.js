var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var alert = require('alert');
var session = require('express-session')
const { BADFAMILY } = require('dns');
const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({resave: true, saveUninitialized: true, secret: 'string'}));

var MongoClient = require('mongodb').MongoClient;

app.get('/',function(req,res){
  res.render('login');
});

var name = "";

app.post('/',function(req,res){
  var user = req.body.username;
  var pass = req.body.password;
  if(user == 'admin' && pass == 'admin'){
    res.redirect('/home');
  }
  else{
    var flag = false;
    MongoClient.connect("mongodb://localhost:27017", function(err, client){
    if (err) throw err;
    var db = client.db('myDB');
    db.collection('myCollection').find().toArray(function(err,results){
        if(err) throw err;
        for (var i = 0; i < results.length; i++){
          if (results[i].username == user && results[i].password == pass){
            flag = true;
            break;
          }
        }
        if (flag == true){
          res.redirect('/home');
          req.session.username = user;
          name = req.session.username
        }
        else{
          alert("Username Or Password Is Incorrect");
          res.redirect('/');
        }
      });
    });
  }
});

app.get('/registration',function(req,res){
  res.render('registration');
});

app.post('/register', function(req,res){
  var user = req.body.username;
  var pass = req.body.password;
  var travList = new Array;
  var flag = false;
  MongoClient.connect("mongodb://localhost:27017", function(err, client){
  if (err) throw err;
  var db = client.db('myDB');
  db.collection('myCollection').find().toArray(function(err,results){
      if(err) throw err;
      if(user == "" || pass == ""){
        alert('Username or Password Can Not Be Empty');
        res.redirect('/registration');
      }
      else{
        for(var i = 0; i < results.length;i++){
          if(results[i].username == user){
            flag = true;
            break;
          }
        }
        if (flag == true){
          alert("Username Already Taken");
          res.redirect('/registration')
        }
        else{
          db.collection('myCollection').insertOne({username: user, password: pass, WantToGo: travList})
          alert('Registration Successful');
          res.redirect('/')
        }
      }
    })
  })
})

app.get('/home',function(req,res){
  res.render('home');
});


app.get('/paris',function(req,res){
  res.render('paris');
});

app.get('/rome',function(req,res){
  res.render('rome');
});


app.get('/santorini',function(req,res){
  res.render('santorini');
});

app.get('/annapurna',function(req,res){
  res.render('annapurna');
});

app.get('/bali',function(req,res){
  res.render('bali');
});

app.get('/inca',function(req,res){
  res.render('inca');
});

app.get('/hiking',function(req,res){
  res.render('hiking');
});

app.get('/cities',function(req,res){
  res.render('cities');
});

app.get('/islands',function(req,res){
  res.render('islands');
});

app.get('/searchresults',function(req,res){
  res.render('searchresults');
});

app.get('/wanttogo',function(req,res){
  MongoClient.connect("mongodb://localhost:27017", function(err, client){
    if (err) throw err;
    var db = client.db('myDB');
    db.collection('myCollection').find().toArray(function(err,results){
        if(err) throw err;
        for (var i = 0; i < results.length;i++){
          if(results[i].username == name){
            index = i;
            break;
         }
       }
       res.render('wanttogo', {list: results[index].WantToGo});
    })
  })
});

app.post('/search', function(req,res){
  var searchfor = req.body.Search
  var result = new Array;
  if("r".includes(searchfor)){
    result = result.concat("paris");
    result = result.concat("rome");
    result = result.concat("annapurna");
  }
  else if("a".includes(searchfor)){
    result = result.concat("paris");
    result = result.concat("bali");
    result = result.concat("annapurna");
    result = result.concat("inca");
    result = result.concat("santorini");
  }
  else if("n".includes(searchfor)){
    result = result.concat("annapurna");
    result = result.concat("inca");
    result = result.concat("santorini");
  }
  else if("an".includes(searchfor)){
    result = result.concat("annapurna");
    result = result.concat("santorini");
  }
  else if("p".includes(searchfor)){
    result = result.concat("annapurna");
    result = result.concat("paris");
  }
  else if("i".includes(searchfor)){
    result = result.concat("inca");
    result = result.concat("santorini");
    result = result.concat("paris");
  }
  else if("ri".includes(searchfor)){
    result = result.concat("santorini");
    result = result.concat("paris");
  }
  else if("s".includes(searchfor)){
    result = result.concat("santorini");
    result = result.concat("paris");
  }
  else if("annapurna".includes(searchfor)){
    result = result.concat("annapurna");
  }
  else if("rome".includes(searchfor)){
    result = result.concat("rome");
  }
  else if("bali".includes(searchfor)){
    result = result.concat("bali");
  }
  else if("inca".includes(searchfor)){
    result = result.concat("inca");
  }
  else if("paris".includes(searchfor)){
    result = result.concat("paris");
  }
  else if("santorini".includes(searchfor)){
    result = result.concat("santorini");
  }
  else{
    result = result.concat("Destination not Found");
  }
  res.render('searchresults', {list: result});
})

app.post('/wantogoANN',function(req,res){
  var index = 0;
  var flag = false;
  MongoClient.connect("mongodb://localhost:27017", function(err, client){
    if (err) throw err;
    var db = client.db('myDB');
    db.collection('myCollection').find().toArray(function(err,results){
      if(err) throw err;
       for (var i = 0; i < results.length;i++){
          if(results[i].username == name){
            index = i;
            break;
          }
       }
        for (var j = 0; j < results[index].WantToGo.length; j++){
          if(results[index].WantToGo[j].localeCompare("annapurna") == 0){
            flag = true;
            break;
          }
        }
        if (flag == true){
          alert("Item Already In Want-To-Go List");
          res.redirect('/annapurna');
        }
        else{
          db.collection('myCollection').updateOne({username: name}, { $set: {WantToGo: results[index].WantToGo = results[index].WantToGo.concat("annapurna")} }, {w:1},function(err, result){
                     if(err) throw err;    
             });;
          res.redirect('/annapurna');
        }
     })
  })
})

app.post('/wantogoBALI',function(req,res){
  var index = 0;
  var flag = false;
  MongoClient.connect("mongodb://localhost:27017", function(err, client){
    if (err) throw err;
    var db = client.db('myDB');
    db.collection('myCollection').find().toArray(function(err,results){
      if(err) throw err;
       for (var i = 0; i < results.length;i++){
          if(results[i].username == name){
            index = i;
            break;
          }
       }
        for (var j = 0; j < results[index].WantToGo.length; j++){
          if(results[index].WantToGo[j].localeCompare("bali") == 0){
            flag = true;
            break;
          }
        }
        if (flag == true){
          alert("Item Already In Want-To-Go List");
          res.redirect('/bali');
        }
        else{
          db.collection('myCollection').updateOne({username: name}, { $set: {WantToGo: results[index].WantToGo = results[index].WantToGo.concat("bali")} }, {w:1},function(err, result){
                     if(err) throw err;    
             });
          res.redirect('/bali');
        }
     })
  })
})

app.post('/wantogoINCA',function(req,res){
  var index = 0;
  var flag = false;
  MongoClient.connect("mongodb://localhost:27017", function(err, client){
    if (err) throw err;
    var db = client.db('myDB');
    db.collection('myCollection').find().toArray(function(err,results){
      if(err) throw err;
       for (var i = 0; i < results.length;i++){
          if(results[i].username == name){
            index = i;
            break;
          }
       }
        for (var j = 0; j < results[index].WantToGo.length; j++){
          if(results[index].WantToGo[j].localeCompare("inca") == 0){
            flag = true;
            break;
          }
        }
        if (flag == true){
          alert("Item Already In Want-To-Go List");
          res.redirect('/inca');
        }
        else{
          db.collection('myCollection').updateOne({username: name}, { $set: {WantToGo: results[index].WantToGo = results[index].WantToGo.concat("inca")} }, {w:1},function(err, result){
                     if(err) throw err;    
             });;
          res.redirect('/inca');
        }
     })
  })
})

app.post('/wantogoPARIS',function(req,res){
  var index = 0;
  var flag = false;
  MongoClient.connect("mongodb://localhost:27017", function(err, client){
    if (err) throw err;
    var db = client.db('myDB');
    db.collection('myCollection').find().toArray(function(err,results){
      if(err) throw err;
       for (var i = 0; i < results.length;i++){
          if(results[i].username == name){
            index = i;
            break;
          }
       }
        for (var j = 0; j < results[index].WantToGo.length; j++){
          if(results[index].WantToGo[j].localeCompare("paris") == 0){
            flag = true;
            break;
          }
        }
        if (flag == true){
          alert("Item Already In Want-To-Go List");
          res.redirect('/paris');
        }
        else{
          db.collection('myCollection').updateOne({username: name}, { $set: {WantToGo: results[index].WantToGo = results[index].WantToGo.concat("paris")} }, {w:1},function(err, result){
                     if(err) throw err;    
             });;
          res.redirect('/paris');
        }
     })
  })
})

app.post('/wantogoROME',function(req,res){
  var index = 0;
  var flag = false;
  MongoClient.connect("mongodb://localhost:27017", function(err, client){
    if (err) throw err;
    var db = client.db('myDB');
    db.collection('myCollection').find().toArray(function(err,results){
      if(err) throw err;
       for (var i = 0; i < results.length;i++){
          if(results[i].username == name){
            index = i;
            break;
          }
       }
        for (var j = 0; j < results[index].WantToGo.length; j++){
          if(results[index].WantToGo[j].localeCompare("rome") == 0){
            flag = true;
            break;
          }
        }
        if (flag == true){
          alert("Item Already In Want-To-Go List");
          res.redirect('/rome');
        }
        else{
          db.collection('myCollection').updateOne({username: name}, { $set: {WantToGo: results[index].WantToGo = results[index].WantToGo.concat("rome")} }, {w:1},function(err, result){
                     if(err) throw err;
             })
          res.redirect('/rome');
        }
     })
  })
})

app.post('/wantogoSANT',function(req,res){
  var index = 0;
  var flag = false;
  MongoClient.connect("mongodb://localhost:27017", function(err, client){
    if (err) throw err;
    var db = client.db('myDB');
    db.collection('myCollection').find().toArray(function(err,results){
      if(err) throw err;
       for (var i = 0; i < results.length;i++){
          if(results[i].username == name){
            index = i;
            break;
          }
       }
        for (var j = 0; j < results[index].WantToGo.length; j++){
          if(results[index].WantToGo[j].localeCompare("santorini") == 0){
            flag = true;
            break;
          }
        }
        if (flag == true){
          alert("Item Already In Want-To-Go List");
          res.redirect('/santorini');
        }
        else{
          db.collection('myCollection').updateOne({username: name}, { $set: {WantToGo: results[index].WantToGo = results[index].WantToGo.concat("santorini")} }, {w:1},function(err, result){
                     if(err) throw err;    
             })
          res.redirect('/santorini');
        }
     })
  })
})

app.listen(3000);