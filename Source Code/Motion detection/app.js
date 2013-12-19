var express=require('express'),http=require('http'),path = require('path'),mongoose=require('mongoose');
var app=express();

app.configure(function(){
app.set('port',process.env.PORT || 3001);
//app.set('views', __dirname + '/views');
//app.enable('view cache');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
//app.set('local messages', true);
});
var MjpegProxy = require('mjpeg-proxy').MjpegProxy;
var cam1 = "http://localhost:8080/?action=stream";

app.get('/',function(req,res){

    res.render('home.jade');
});
app.get('/test',function(req,res){
    res.render('index.jade');
});
app.use(function(req,res){
res.render('notfound.jade');
});
app.get('/index', new MjpegProxy(cam1).proxyRequest);

http.createServer(app).listen(app.get('port'),function(){
console.log("EXPRESS is running on PORT " + app.get('port'));
});
