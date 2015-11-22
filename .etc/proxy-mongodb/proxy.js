
// var util = require('util'),
//     colors = require('colors'),
//     http = require('http'),
//     httpProxy = require('http-proxy');

// // Setup proxy server with forwarding
// //
// // var test = new httpProxy.createServer({
// //   // target: {
// //   //   port: 3001,
// //   //   host: 'server.devtest.com'
// //   // },
// //   target:'http://localhost:3001',
// //   target:'http://localhost:3002'

// //   // forward: {
// //   //   port: 3002,
// //   //   host: 'client.devtest.com'
// //   // }
// // }).listen(80);



// httpProxy.createServer({
//   forward: {
//     port: 3001,
//     host: 'localhost'
//   }
// }).listen(80)


// // test.on('error', function(err, req, res) {
// //     res.end();
// // });



// util.puts('http proxy server started on port with forward proxy'.magenta.underline);











// var util = require('util'),
//     colors = require('colors'),
//     http = require('http'),
//     httpProxy = require('http-proxy');

// var welcome = [
//   '#    # ##### ##### #####        #####  #####   ####  #    # #   #',
//   '#    #   #     #   #    #       #    # #    # #    #  #  #   # # ',
//   '######   #     #   #    # ##### #    # #    # #    #   ##     #  ',
//   '#    #   #     #   #####        #####  #####  #    #   ##     #  ',
//   '#    #   #     #   #            #      #   #  #    #  #  #    #  ',
//   '#    #   #     #   #            #      #    #  ####  #    #   #  '
// ].join('\n');

// util.puts(welcome.rainbow.bold);

// httpProxy.createServer({
//   target: {
//     port: 3000,
//     host: 'server.devtest.com'
//   },
//   forward: {
//     port: 3060,
//     host: 'client.devtest.com'
//   }
// }).listen(3010);





var http = require('http');
var httpProxy = require('http-proxy');

var normalProxy = new httpProxy.createProxyServer({
    target: {
    host: 'localhost',
    port: 3001
}});

var webSocketProxy = new httpProxy.createProxyServer({
    target: {
    host: 'localhost',
    port: 3002
}});

var server = http.createServer(function ( req, res ) {
    if (req.headers.host == 'client.devtest.com:3000') {
        normalProxy.web( req, res );
    } else if (req.headers.host == 'server.devtest.com:3000') {
        webSocketProxy.web( req, res );
    } else {

        res.writeHead(404);
        res.end();
    }
});



webSocketProxy.on('error', function(err, req, res) {
    res.end();
});


normalProxy.on('error', function(err, req, res) {
    res.end();
});

server.on('error', function(err, req, res) {

});


server.on( 'upgrade', function( req, socket, head ) {
    webSocketProxy.ws( req, socket, head );
});

process.env.PORT = 3000;
server.listen(process.env.PORT);
console.log('**************************** Proxy on port: %s ****************************', process.env.PORT);

