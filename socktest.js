var io = require('socket.io').listen(80);
var ss = require('socket.io-stream');
var path = require('path');
var fs = require("fs");

io.of('/user').on('connection', function(socket) {
  ss(socket).on('profile-image', function(stream, data) {
    debugger;
    stream.pipe(fs.createWriteStream("./" + data));
  });
});