/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    sio = require('socket.io'),
    async = require('async'),
    piblaster = require('pi-blaster.js'),
    moteur = {},
    _moteurBas  = 0.15,
    _moteurHaut   = 0.15,
    app = module.exports = express.createServer(),
    io = sio.listen(app);

// Configuration
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

app.listen(3000);
console.log('Listening %d in %s mode', app.address().port, app.settings.env);

moteur.initPins = function(){
  async.parallel([
      piblaster.setPwm(2, _moteurBas),
      piblaster.setPwm(1, _moteurHaut)
  ]);
};

moteur.haut = function(){

    if(_moteurHaut<0.24)  { _moteurHaut=_moteurHaut+0.01;
    piblaster.setPwm(1, _moteurHaut) ;                     }

};

moteur.bas = function(){
    if(_moteurHaut>0.07)  { _moteurHaut=_moteurHaut-0.01;
        piblaster.setPwm(1, _moteurHaut) ;}
};

moteur.droite = function(){
    if(_moteurBas<0.24)  { _moteurBas=_moteurBas+0.01;
        piblaster.setPwm(2, _moteurBas) ;}
};

moteur.gauche = function(){
    if(_moteurBas>0.07)  { _moteurBas=_moteurBas-0.01;
        piblaster.setPwm(2, _moteurBas) ;  }
    };


io.sockets.on('connection', function(socket) {
  
  socket.on('keydown', function(dir) {
    switch(dir){
     case 'up':
        moteur.haut();
        break;
      case 'down':
        moteur.bas();
        break;
      case 'left':
        moteur.gauche();
        break;
      case 'right':
        moteur.droite();
        break;
    }
  });


});

moteur.initPins();
