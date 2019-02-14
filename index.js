var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
//var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customer', ['users']);
var ObjectId = mongojs.ObjectId;

var app = express();

/*
var logger = function(req, res, next){
    console.log('logging');
    next();
}

app.use(logger);
*/

//view engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));

//body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path
app.use(express.static(path.join(__dirname,'public')));

//global vars
app.use(function(req,res,next){
    res.locals.errors = null;
    next();
});

app.get('/', function(req,res){
    db.users.find(function (err, docs) {
        res.render('index',{
            title : 'customerApp',
            users: docs
        });
    })
});

app.post('/users/add',function(req,res){

        var newUser = {
            first_name: req.body.first_name, 
            last_name: req.body.last_name, 
            email: req.body.email
        }
        db.users.insert(newUser, function(err, result){
            if(err){
                console.log(err);
            }
            res.redirect('/');
        });
});

// app.update('/uses/update/:first_name', function(req, res){
//     db.users.update({_id: ObjectId(req.params.)}, function(err, result){
//         if(err){
//             console.log(err);
//         }
//         res.redirect('/');
//     });
// });

app.delete('/users/delete/:id', function(req, res){
    db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
})

app.listen(3000, function(){
    console.log('connected');
});