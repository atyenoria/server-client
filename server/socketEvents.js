var count=0


exports = module.exports = function(io) {
  io.on('connection', function(socket) {
    console.log("++++++++socket connect+++++++++++")


    // if((count % 2) === 1){socket.join('room1')}else{
    socket.join('room2')
    // }


    // socket.join('room2')
    // count +=1
    // console.log(socket.nsp.server.engine.clients)  
    // console.log(socket.nsp)
    // console.log ("total %s connections",count)
    // console.log("%s in room1 ", Object.keys(io.sockets.adapter.rooms['room1']).length);
    // console.log("%s in room2 ", Object.keys(io.sockets.adapter.rooms['room2']).length);
    // console.log(io.sockets.adapter.rooms['room1'])
    // for (var clientId in clients) {



    socket.emit('test',{test: "server ok"})
    socket.emit('socketid' , socket.id)
    console.log(socket.id)
    
    socket.on('restart', function(channel) {
      console.log("client restartd")
    });
    
    socket.on('new message', function(msg) {
      socket.to('room2').emit('new bc message', msg);
      console.log(socket.id)
      // console.log(this.socket.sessionid);
      // socket.broadcast.emit('new bc message', msg);
      console.log('new message')
    });
    socket.on('new channel', function(channel) {
      socket.broadcast.emit('new channel', channel)
    });
    socket.on('typing', function () {
      console.log("typing")
      socket.broadcast.emit('typing bc', socket.username);
    });
    socket.on('stop typing', function () {
      socket.broadcast.emit('stop typing bc', socket.username);
  });
  
  socket.on('id msg', function (msg) {
    console.log(socket.id)
    console.log("on:id msg")
    console.log(msg[0].id)
    // socket.to('room2').emit('gg',{test: "msg1 ok"})
    socket.to(msg[0].id).emit('gg',{test: "msg2 ok"})
  });


})};

