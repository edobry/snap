var snapchat = require("snapchat");

var client = new snapchat.Client();

var exports = {};

exports.getSnaps = function(username, password) {
	return client.login(username, password);
};

exports.getBlob = function(id) {
	return client.getBlob(id);
};

module.exports = exports;