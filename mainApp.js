var express = require('express');
var database = require('./db');
var bodyParser = require('body-parser');

var app = express();
var db = new database();
var path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname + "/public", "views"));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname + '/', 'public')));

console.log("Server start!");

app.get('/', function (req, res) {
    'use strict';
    res.render('index', {title: 'Home'});
});

app.get('/api', function (req, res) {
    var payload = {};
    db.find(payload, function (results) {
        res.send(results);
    });
});

app.get("/api/:user_id", function (req, res) {
    var payload = {user : req.params.user_id};
    db.find(payload, function (results) {
       res.send(results);
       console.log(results);
    });
});

function updateData(req, res){
    var payload = {user: req.params.user_id};
    var data = {
        user: req.params.user_id,
        led: false
    };

    if(req.body.led === true){
        data.led = true;
    }

    db.find(payload, function (results) {
        if(results.length > 0){
            db.update(data);
            res.send("Data has been updated");
        }else{
            db.insert(data);
            res.send("Data has been inserted");
        }
    });
}

app.put('/api/:user_id', function (req, res) {
    updateData(req, res)
});

app.post('/', function (req, res) {
    var userID = req.body.user;
    var payload = {
        user:   userID
    };
    var led = (req.body.led === "on");
    var data = {
        user:   userID,
        led:    led
    };
    
    db.find(payload, function (results) {
        if(results.length > 0){
            db.update(data);
            res.send("Data has been updated");
        }else{
            db.insert(data);
            res.send("Data has been inserted");
        }
    });
});

app.post('/api/:user_id', function (req, res) {
    updateData(req, res)
});

app.delete('/api:user_id', function (req, res) {
    res.send({});
});


/**
 *  DashBoard
 */
app.get('/dashboard', function (req, res) {
   'use strict';
   res.render("dashboard", {
       title:   'Dashboard'
   });
});

/**
 * Get latest data
 */
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
function makeRequest(url)
{
    var httpRequest = new XMLHttpRequest();
    if(!httpRequest){
        alert('Giving up: (Cannot create an XMLHttp instance)');
        return false;
    }

    httpRequest.onreadystatechange = function () {
        //https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/readyState
        if(httpRequest.readyState === httpRequest.DONE){
            //https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
            if(httpRequest.status === 200){
                console.log(httpRequest.responseText);
            }else{
                alert('There war a problem with the request.'+ httpRequest.status);
            }
        }
    };
    httpRequest.open('GET', url);
    httpRequest.send();
}
//makeRequest('/api/1');

//jQuery -> makeRequest.html

app.get('/user/:user_id/devices/:devices_id/result', function (req, res) {
   var payload = {
       user:    parseInt(req.params.user_id),
       device:  parseInt(req.params.devices_id)
   };
   db.find(payload, function (result) {
       return res.json(result);
   });
});

app.post('/user/:user_id/devices/:devices_id', function (req, res) {
   var data = req.body;
   data.user = parseInt(req.params.user_id);
   data.device = parseInt(req.params.devices_id);
   db.insert(data);
   res.send({db: 'inserted'});
});

app.post('/user/:user_id/devices/:devices_id/result/:result_id', function (req, res) {
   var payload = {
       user:    parseInt(req.params.user_id),
       device:  parseInt(req.params.devices_id)
   };
   db.findOrder(payload, parseInt(req.params.result_id), function (result) {
        return res.json(result);
   });
});


app.listen(8080);
