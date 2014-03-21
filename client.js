var snapchat = require("snapchat");

var client = new snapchat.Client();

client.getSnaps = function(username, password, cb) {
	client.login(username, password).then(function(data) {
		if (typeof data.snaps === 'undefined') {
			console.log(data);
			return;
		}

		cb(data.snaps);
	});
};

module.exports = client;