var fs = require("fs"),
    sys = require("sys"),
    util = require("./util"),
    client = require("./client");

var saveSnaps = function (snaps) {    
    // Make sure the images folder exists
    if (!fs.existsSync('./images'))
        fs.mkdirSync('./images');
    
    snaps.forEach(function(snap) {
        // Make sure the snap item is unopened and sent to you (not sent by you)
        if (typeof snap.sn !== 'undefined' && typeof snap.t !== 'undefined' && snap.st == 1) {
            console.log('Saving snap from ' + snap.sn + '...');

            // Save the image to ./images/{SENDER USERNAME}_{SNAP ID}.jpg
            var stream = fs.createWriteStream('./images/' + snap.sn + '_' + snap.id + '.jpg', {
                flags: 'w',
                encoding: null,
                mode: 0666
            });
            client.getBlob(snap.id).then(function(blob) {
                blob.pipe(stream);
                blob.resume();
            });
        }
    });
};

var showSnaps = function (snaps) {
    snaps.forEach(function(snap) {
        
    });
};

var stdin = process.openStdin(),
    stdout = process.stdout;

var ask = util.makeAsker(stdin, stdout);
ask("Username", function(user) {
    ask("Password", function(pass) {
        client.getSnaps(user, pass, saveSnaps);
    });
});
