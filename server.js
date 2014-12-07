var fs = require("fs"),
    util = require("./util"),
    client = require("./client"),
    http = require("http"),
    static = require("node-static");
//var ss = require('socket.io-stream');

var file = new static.Server('.');
console.log("static server init");

var login = function(req, res) {
	console.log("login attempt");

	var body = "";
        
    req.on("data", function(chunk) {
    	body += chunk.toString();
		console.log("writing chunk");
    });
    
    req.on("end", function() {
		var creds = JSON.parse(body);
		console.log(creds);

		res.writeHead(200, "OK", {
			"Content-Type": "application/json",
		});

		getSnaps(creds).done(function(images) {
			var out = JSON.stringify(images);
			console.log(out);
			res.write(out);
		});

		res.end();
    });

	var getSnaps = function(creds) {
		return client.getSnaps(creds.user, creds.pass).then(function(data) {
			console.log("they're using an older code but it checks out");
			var images = data.snaps.filter(function(snap) {
				return snap.rp && snap.ts && snap.st == 1;
			}).map(function(snap) {
		        console.log("Snap from " + snap.rp);

		        var path = "./images/" + snap.rp + '_' + snap.id + ".jpg";

		        var stream = fs.createWriteStream(path, {
		            flags: 'w',
		            encoding: null,
		            mode: 0666
		        });

		        client.getBlob(snap.id).then(function(blob) {
		            // var stream = ss.createStream();
		            // ss(socket).emit('blob', stream);

		            blob.pipe(stream);
		            blob.resume();
		        });
		        console.log(path);
		        return path;
		    });

			console.log("snaps get");
		    console.log(images);

		    return images;
		});
	};
};

var routes = {
	"static": function(req, res) {
		return file.serve(req, res);
	},
	"login": login
};

http.createServer(function(req, res) {
	var path = req.url.split('/');

	var handler = routes[path[1]];

	req.url = path.slice(2).join('/');

	handler(req, res);
}).listen(80);

console.log("listening on port 80");
console.log("routing table:");
console.log(Object.keys(routes));


