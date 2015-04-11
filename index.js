var express = require('express');
var app = express();


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

var pg = require('pg');

app.post('/login', function (request, response) {
   console.log("SUP")
})


app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL || "postgres://qyczllslpshilf:C5b-rPxAiZ88wuAeqSsdbe_l2s@ec2-107-20-159-103.compute-1.amazonaws.com:5432/dd8b76iderq0v1?ssl=true"
 , function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
  });
})