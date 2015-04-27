var express = require('express');
var app = express();
var DB_URL = process.env.DATABASE_URL || "postgres://qyczllslpshilf:C5b-rPxAiZ88wuAeqSsdbe_l2s@ec2-107-20-159-103.compute-1.amazonaws.com:5432/dd8b76iderq0v1?ssl=true";
var bodyParser = require('body-parser');
var pg = require('pg');
var crypto = require('crypto');
var session = require('client-sessions');

app.use(session({
    cookieName: 'session',
    secret: '4206942069sixtynine',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


var login = function (req, res){
    
    var userName = req.body.userName;
    var password = req.body.password;
    var hashpass = crypto.createHash("md5").update(password).digest('hex');
    var queryText = 'select id from Users where username=\'' + userName + '\' and hashpass=\'' + hashpass + '\'';
    
    // console.log(queryText)
    
    pg.connect(DB_URL, function(err, client, done) {
        client.query(queryText, function(err, result) {
            done();
            
            if (err) {
                console.error(err);
            }
            else {
                if (result.rows[0] != undefined) { 
                    console.log("Successful Login");
                    req.session.user = userName; 
                    req.session.user_id = result.rows[0].id;
                    res.redirect("/");
                } 
                else { 
                    console.error("Fail Login!")
                    res.redirect("/")
                }
            }
        });
    });
}

var fly = function(messageId) {

    var queryText = "SELECT id FROM Users WHERE NOT message_received_list @> ARRAY[" + messageId +  " ] AND NOT message_sent_list @>  ARRAY[" + messageId + "] ORDER BY RANDOM() LIMIT 2"
  
    pg.connect(DB_URL, function(err, client, done) {
        client.query(queryText, function(err, result) {
            done();
          
            if (err) { 
                // handle error
                console.error(err);
            }
          
            else { 
                var rows = result.rows;
                for (i in rows) {
                    var userId = rows[i].id; 
                    console.log(userId)
                    var sendQuery = "UPDATE Users set message_received_list = array_append(message_received_list, $1) WHERE id=" + userId;
                    console.log(sendQuery)
                      
                    client.query(sendQuery, [messageId] ,function(err, result) {
                        if (err) {
                          // handle error
                          console.error(err);
                        }
                        else {
                          console.log("IT IS ALRIGHT")
                        }
                    })
                }
            }

        })
    })
}


app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})

app.post('/login', function (req, res) {
    login(req, res);
})

app.get('/session.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(req.session);
})

app.delete('/logout', function (req, res) {
    req.session.reset();
    console.log("Successful Logout!")
    res.redirect(303, '/')
})

app.post('/message', function(req, res){
    
    var message = req.body.message;
    var user_id = req.session.user_id;
    var messageQuery = "INSERT INTO messages(content, user_id, user_list) VALUES($1, $2,$3) RETURNING id"

    pg.connect(DB_URL, function(err, client, done) {
        client.query(messageQuery, [message, user_id, [user_id]], function(err, result) {
            if(err) {
                //hadnle error
            }
            else {
                messageId = result.rows[0].id
                var userQuery = "UPDATE Users set message_sent_list = array_append(message_sent_list, $1) WHERE id=" + user_id;
                
                client.query(userQuery, [messageId], function(err, result) {
                    if(err){
                    // handle error
                    }
                    else {
                    fly(messageId)
                    }
                })
            }
        })
    })
})


app.post('/register', function (req, res) {

    var user = req.body.userName;
    var hashpass = crypto.createHash("md5").update(req.body.password).digest('hex');
    var queryText = "INSERT INTO Users(username,hashpass) VALUES($1, $2) RETURNING id"
     
    pg.connect(DB_URL, function(err, client, done) {
        client.query(queryText, [user, hashpass], function(err, result) {
            if(err) {
                // handle error
                console.error("ERROR REGISTERING: " + err) 
            }
            else {
                login(req,res);
            }
        })
    })
})


app.get('/db', function (request, response) {
    pg.connect(DB_URL, function(err, client, done) {
        client.query('SELECT * FROM Users', function(err, result) {
            done();
            if (err) { 
                console.error(err);
                response.send("Error " + err);
            }
            else {
                response.send(result.rows); 
            }
        });
    });
})