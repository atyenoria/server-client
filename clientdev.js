'use strict';
var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var app = express();
var compiler = webpack(config);




process.env.PORT = 3001;

// connect our DB
process.on('uncaughtException', function(err) {
    console.log(err);
});


app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    reload: true,
    hot: true,
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
}));

app.use(require('webpack-hot-middleware')(compiler));


app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));

});

app.listen(process.env.PORT, 'localhost', function(err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('**************************** ClientDev on port: %s ****************************', process.env.PORT);

});