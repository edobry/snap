var snapchat = require("snapchat"),	
	fs = require("fs"),
	sys = require("sys"),
	util = require("./util");

var stdin = process.openStdin();
stdin.addListener("data", function(d) {
	var d = d.toString().substring(0, d.length-1);
});


var client = new snapchat.Client();
    
// Make sure the images folder exists
if(!fs.existsSync('./images')) {
    fs.mkdirSync('./images');
}

client.login('gingervitiz', '').then(function(data) {
    // Handle any problems, such as wrong password
    if (typeof data.snaps === 'undefined') {
        console.log(data);
        return;
    }

    // Loop through the latest snaps
    data.snaps.forEach(function(snap) {
        // Make sure the snap item is unopened and sent to you (not sent by you)
        if (typeof snap.sn !== 'undefined' && typeof snap.t !== 'undefined' && snap.st == 1) {
            console.log('Saving snap from ' + snap.sn + '...');

            // Save the image to ./images/{SENDER USERNAME}_{SNAP ID}.jpg
            var stream = fs.createWriteStream('./images/' + snap.sn + '_' + snap.id + '.jpg', { flags: 'w', encoding: null, mode: 0666 });
            client.getBlob(snap.id).then(function(blob) {
				blob.pipe(stream);
				blob.resume();
		    });
        }
    });
});