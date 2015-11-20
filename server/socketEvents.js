var count=0

exports = module.exports = function(io) {
  io.on('connection', function(socket) {
    // console.log(socket)

    if((count % 2) === 1){socket.join('room1')}else{
    socket.join('room2')
    }

    // socket.join('room2')

    // count +=1
    // console.log(count % 2)
    // console.log (count)
    // var clients = io.sockets.adapter.rooms['test room'];
    // console.log(clients);
    // for (var clientId in clients) {
    // console.log(io.sockets.connected[clientId]);
    // }

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
      socket.broadcast.emit('typing bc', socket.username);
    });
    socket.on('stop typing', function () {
      socket.broadcast.emit('stop typing bc', socket.username);
    });
  });
}
