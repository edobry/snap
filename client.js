var snapchat = require("snapchat");

var client = new snapchat.Client();

client.getSnaps = function(username, password) {
	return client.login(username, password);
};

module.exports = client;