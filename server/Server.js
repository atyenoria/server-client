var w = require('winston').log;
var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);

var mongoose = require('mongoose');
var session = require('express-session');
var cors = require('cors');
var app = express();

var morgan = require('morgan')
var uuid = require('node-uuid')
morgan.token('id', function getId(req) {
    return req.id
})

app.use(assignId)
app.use(morgan(' ":method :url HTTP/:http-version" :status :res[content-length]'))

function assignId(req, res, next) {
    req.id = uuid.v4()
    next()
}



var passport = require('passport');
require('./passport/passport')(passport);

var MongoStore = require('connect-mongo')(session);

var User = require('./models/User');
process.env.MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/chat_dev';
process.env.PORT = 3000;
mongoose.connect(process.env.MONGOLAB_URI);




app.use(session({
    secret: 'secret',
    store: new MongoStore({
        url: 'mongodb://localhost/sample'
    }),
    cookie: {
        httpOnly: false,
        maxAge: new Date(Date.now() + 60 * 60 * 1000)
    },
    resave: false,
    saveUninitialized: true
}));



import {
    testrouter
}
from './routes/test'

app.use('/jwt', testrouter);









process.on('uncaughtException', function(err) {
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
require('./routes/channel_routes')(channelRouter);
require('./routes/message_routes')(messageRouter);
app.use('/api', messageRouter);
app.use('/api', usersRouter);
app.use('/api', channelRouter);
app.get('*', function(req, res) {
    // console.log(req)
    res.sendFile(path.join(__dirname, '../index.html'));
});









var server = app.listen(process.env.PORT, 'localhost', function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('**************************** App Server on port: %s ****************************', process.env.PORT);
});


var REDIS_HOST = "localhost"
var REDIS_PORT = "6379"
var io = require('socket.io')(server);
var redis = require('redis').createClient;
var adapter = require('socket.io-redis');
var pub = redis(REDIS_PORT, REDIS_HOST);
var sub = redis(REDIS_PORT, REDIS_HOST);
io.adapter(adapter({
    pubClient: pub,
    subClient: sub
}));
var socketEvents = require('./socketEvents')(io);