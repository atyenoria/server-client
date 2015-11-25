'use strict';

var w = require('winston').log;
var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);

var mongoose = require('mongoose');
var session = require('express-session');
var cors = require('cors');
var app = express();
import { connect } from './models/User';
import { User3 }  from './models/User' 


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






app.get('/setup', function(req, res) {

	// create a sample user
  // get our mongoose model
	// var nick = new User({
	// 	name: 'Nick Cerminara',
	// 	password: 'password',
	// 	admin: true
	// });
    
//     var nick = new User({
//     local: {
//         username: "sample",
//         password: "String",
//         email: "String",
//         socketid: "String",
//     }
// });
	
	var nick = new User3({
		name: 'test',
		password: 'password',
		admin: true
	});
   
	nick.save(function(err) {
		if (err) throw err;
		console.log('User saved successfully');
		res.json({ success: true });
	});
    
});


var apiRoutes = express.Router();
apiRoutes.post('/authenticate', function(req, res) {

	// find the user
	User.findOne({
		name: req.body.name
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			// check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign(user, app.get('superSecret'), {
					expiresInMinutes: 1440 // expires in 24 hours
				});

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}

		}

	});
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});

	}

});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/jwt', apiRoutes);









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
require('./routes/channel_routes')(channelRouter, passport);
require('./routes/message_routes')(messageRouter, passport);
// require('./server/routes/user_routes')(usersRouter)
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