var fs = require("fs"),
    sys = require("sys"),
    util = require("./util"),
    client = require("./client");
var io = require('socket.io');
var ss = require('socket.io-stream');
var path = require('path');
var fs = require("fs");

var stdin = process.openStdin(),
    stdout = process.stdout;

var _snaps = [];

var listen = function () {
    io = io.listen(80);
    console.log("Listening on port 80");
    io.of('/test').on('connection', function(socket) {
        socket.on('ready', function (){
            //_snaps.forEach(function(snap) {
                // Make sure the snap item is unopened and sent to you (not sent by you)
                var snap = _snaps[0];
                if (typeof snap.sn !== 'undefined' && typeof snap.t !== 'undefined' && snap.st == 1) {
                    console.log('Sending snap from ' + snap.sn + '...');

                    client.getBlob(snap.id).then(function(blob) {
                        var stream = ss.createStream();
                        ss(socket).emit('blob', stream);

                        blob.pipe(stream);
                        blob.resume();
                    });
                }
            //});
        });
    });
};

var ask = util.makeAsker(stdin, stdout);
ask("Username", function(user) {
    ask("Password", function(pass) {
        client.getSnaps(user, pass, function (snaps) {
            _snaps = snaps;

            listen();
        });
    });
});