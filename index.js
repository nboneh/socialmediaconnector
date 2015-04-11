var express = require('express');
var app = express();
var DB_URL = process.env.DATABASE_URL || "postgres://qyczllslpshilf:C5b-rPxAiZ88wuAeqSsdbe_l2s@ec2-107-20-159-103.compute-1.amazonaws.com:5432/dd8b76iderq0v1?ssl=true";
var bodyParser = require('body-parser');
var pg = require('pg');
var crypto = require('crypto');
var session = require('client-sessions');


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



var login = function (userName, password, req){
	var hashpass = crypto.createHash("md5").update(password).digest('hex');
	var queryText = 'select exists(select 1 from Users where username=\'' + userName + '\' and hashpass= \'' + hashpass + '\')';
		pg.connect(DB_URL
 , function(err, client, done) {
	 client.query(queryText, function(err, result) {
      done();
      if (err)
       { console.error(err);  }
      else
       { 
       	if(result.rows[0].exists == true)
       	{ console.log("Successful Login");
       req.session.isAuthenticated = true; 
   			} 
		else 
			{ console.log("Fail Login!")}
		}
    });
	});
  }



app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

app.get('/session', function (req, res) {
   res.setHeader('Content-Type', 'application/json');
   console.log(req.session.isAuthenticated)
    res.send(req.session);
})

app.post('/login', function (req, res) {
   login(req.body.userName, req.body.password, req);
   res.redirect("/");
})

app.post('/register', function (req, res) {

var user = req.body.userName;
var hashpass = crypto.createHash("md5").update(req.body.password).digest('hex');
console.log(hashpass);
var queryText = "INSERT INTO Users(username,hashpass) VALUES($1, $2) RETURNING id"
 
 pg.connect(DB_URL
 , function(err, client, done) {
 	client.query(queryText, [user, hashpass], function(err, result){
 		if(err){
 			console.error("ERROR REGISTERING: " + err) 
 		}
 		else {
 			login(user,req.body.password ,req);
 			res.redirect("/");
 		}
 	})
 })
})


app.get('/db', function (request, response) {
  pg.connect(DB_URL
 , function(err, client, done) {
    client.query('SELECT * FROM Users', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
  });
})
