'use strict';

var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var mongoose = require('mongoose');
var session = require('express-session');
var cors = require('cors');
var webpack = require('webpack');
var config = require('../webpack.config.dev');
var app = express();
var compiler = webpack(config);

var passport = require('passport');
require('./passport/passport')(passport);

var MongoStore = require('connect-mongo')(session);

var User = require('./models/User');
//set env vars
process.env.MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/chat_dev';
process.env.PORT = 3000;


// connect our DB
mongoose.connect(process.env.MONGOLAB_URI);
// Basic usage

// app.use(session({
//   secret: 'keyboard kitty',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { maxAge: 600000000 }
// }));

app.use(session({
    secret: 'secret',
    store: new MongoStore({ url: 'mongodb://localhost/test-app' }),
    cookie: {
        httpOnly: false,
        maxAge: new Date(Date.now() + 60 * 60 * 1000)
    },
    resave: true,
    saveUninitialized: true
}));



process.on('uncaughtException', function (err) {
  console.log(err);
});

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

app.use(cors());



app.use(passport.initialize());
app.use(passport.session());
//load routers
var messageRouter = express.Router();
var usersRouter = express.Router();
var channelRouter = express.Router();
require('./routes/message_routes')(messageRouter);
require('./routes/channel_routes')(channelRouter);
require('./routes/user_routes')(usersRouter, passport);
// require('./server/routes/user_routes')(usersRouter)
app.use('/api', messageRouter);
app.use('/api', usersRouter);
app.use('/api', channelRouter);
app.get('*', function(req, res) {
  // console.log(req)
  res.sendFile(path.join(__dirname, '../index.html'));
});

var webpackServer = app.listen(process.env.PORT, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('server listening on port: %s', process.env.PORT);
});

// attach socket.io onto our development server
var io = require('socket.io')(webpackServer);
var socketEvents = require('./socketEvents')(io);
