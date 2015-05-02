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
                console.error("Wrong Username or Password!")
                console.error(err);
                res.redirect("/?message=Wrong Username or Password!");
            }
            else {
                if (result.rows[0] != undefined) { 
                    console.log("Successful Login");
                    req.session.user = userName; 
                    req.session.user_id = result.rows[0].id;
                    res.redirect("/");
                } 
                else { 

                    // handle error
                    // let user know whats wrong
                    // need a function here
                    console.error("Fail Login!")
                    // res.redirect("/?message=Wrong Username or Password!");
                   res.redirect("/?message=Wrong Username or Password!");
                }
            }
        });
    });
}

var fly = function(messageId,res) {

    var queryText = "SELECT id FROM Users WHERE NOT message_received_list @> ARRAY[" +  messageId +  " ]  AND NOT message_sent_list @>  ARRAY[" + messageId + "] AND NOT message_passed_list @>  ARRAY[" + messageId + "]  ORDER BY RANDOM() LIMIT 2";
  
    pg.connect(DB_URL, function(err, client, done) {
        client.query(queryText, function(err, result) {
            done();
          
            if (err) { 
                // handle error
                console.error(err);
            }
          
            else { 
                var rows = result.rows;
                var numOfUsers = rows.length;
                if(numOfUsers == 0 ){
                    res.redirect("/");
                    return;
                }
                var ids = []
                for (i in rows) {
                   ids.push(rows[i].id); 
                }
                var sendQuery = "UPDATE Users set message_received_list = array_append(message_received_list, $1) WHERE id IN (" + ids + ")";
                      
                    client.query(sendQuery, [messageId] ,function(err, result) {
                        if (err) {
                          // handle error
                          console.error(err);
                        }
                        else {
                          var updateMessage = "UPDATE Messages set user_list = array_cat(user_list, ARRAY[ " + ids + "]) WHERE id=" + messageId;
                        
                        client.query(updateMessage, function(err, result) {
                        if (err) {
                          // handle error
                          console.error(err);
                        } else {
                
                                res.redirect("/")

                        }
                        })
                    }   
                    })
                }

        })
    })
}
var getMessages = function(result,message_ids_passed){
    var returnJSON = []
                if(result == undefined){
                    return returnJSON;
                }
                 var rows = result.rows;
                 for(i in rows){
                    var row = rows[i]
                    var messageObj = {}
                    var id = row.id;
                    if(message_ids_passed != undefined){
                     if(message_ids_passed.indexOf(id) != -1)
                        messageObj.passed = true;
                    else 
                        messageObj.passed = false;
                    }
                    messageObj.content = row.content;
                    messageObj.time_created = row.time_created;
                    messageObj.times_passed = row.user_list.length;
                    if(message_ids_passed != undefined){
                    messageObj.user = row.username;
                    }
                    messageObj.id = id;
                    returnJSON.push(messageObj)
           }
           return returnJSON;
}

app.get('/inbox.json', function(req,res){
    var returnJSON = []
    var message_ids_passed = []
    var message_ids_received = []
    var user_id = req.session.user_id;
     pg.connect(DB_URL, function(err, client, done) {
         var queryText = "SELECT message_received_list, message_passed_list FROM Users WHERE id = "+ user_id;
        client.query(queryText, function(err, result) {
            done();
            message_ids_received= result.rows[0].message_received_list;
            message_ids_ = result.rows[0].message_passed_list
            all_ids = message_ids_passed.concat(message_ids_received)
             var queryText2 = "SELECT * FROM Messages WHERE id IN (" + all_ids + ")";
            client.query(queryText2, function(err, result) {
                 res.send(getMessages(result, message_ids_passed))
            })
        
      })
    })
 })

app.get('/outbox.json', function(req,res){
        var returnJSON = []
    var user_id = req.session.user_id;
     pg.connect(DB_URL, function(err, client, done) {
         var queryText = "SELECT message_sent_list FROM Users WHERE id = "+ user_id;
        client.query(queryText, function(err, result) {
            done();
             var queryText2 = "SELECT * FROM Messages WHERE id IN (" + result.rows[0].message_sent_list + ")";
            client.query(queryText2, function(err, result) {
                 res.send(getMessages(result, undefined))
            })
        
      })
    })
 })



app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})

app.post('/login', function (req, res) {
    login(req, res);
})

app.put('/fly', function (req, res) {
    var messageId = req.body.id;
    var user_id = req.session.user_id;
    var query = "UPDATE Users set message_passed_list = array_append(message_passed_list, $1) WHERE id=" + user_id;

    pg.connect(DB_URL, function(err, client, done) {
        client.query(query, [messageId], function(err, result) {
            if(err) {
                //hadnle error
            }
            else {
                 query = "UPDATE Users set message_received_list = array_remove(message_received_list, $1) WHERE id=" + user_id;
                
                client.query(query, [messageId], function(err, result) {
                    if(err){
                    // handle error
                    }
                    else {
                    fly(messageId,res)
                    }
                })
            }
        })
    })

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
    var userName = req.session.user;
    var messageQuery = "INSERT INTO messages(content, user_id, username) VALUES($1, $2, $3) RETURNING id"

    pg.connect(DB_URL, function(err, client, done) {
        client.query(messageQuery, [message, user_id,  userName], function(err, result) {
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
                    fly(messageId,res)
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
                // let user know what's wrong -- need another functino to take care of it

                console.error("ERROR REGISTERING: " + err) 
                // only refreshes the page!!!
                res.redirect("/?message=User already exists!");
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