'use strict';

var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);

var mongoose = require('mongoose');
var session = require('express-session');
var cors = require('cors');
var app = express();

var passport = require('passport');
require('./passport/passport')(passport);

var MongoStore = require('connect-mongo')(session);

var User = require('./models/User');
process.env.MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/chat_dev';
process.env.PORT = 3000;
mongoose.connect(process.env.MONGOLAB_URI);





app.use(session({
    secret: 'secret',
    store: new MongoStore({ url: 'mongodb://localhost/sample' }),
    cookie: {
        httpOnly: false,
        maxAge: new Date(Date.now() + 60 * 60 * 1000)
    },
    resave: false,
    saveUninitialized: true
}));



process.on('uncaughtException', function (err) {
  console.log(err);
});


app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
//load routers
var messageRouter = express.Router();
var usersRouter = express.Router();
var channelRouter = express.Router();
require('./routes/user_routes')(usersRouter, passport);
require('./routes/channel_routes')(channelRouter, passport);
require('./routes/message_routes')(messageRouter, passport);
// require('./server/routes/user_routes')(usersRouter)
app.use('/api', messageRouter);
app.use('/api', usersRouter);
app.use('/api', channelRouter);
app.get('*', function(req, res) {
  // console.log(req)
  res.sendFile(path.join(__dirname, './index.html'));
});

var proxy = require('express-http-proxy');




var server = app.listen(process.env.PORT, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('**************************** App Server on port: %s ****************************', process.env.PORT);
});



var io = require('socket.io')(server);
var socketEvents = require('./socketEvents')(io);