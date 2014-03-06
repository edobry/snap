var util = {};

util.head = function (arr) {
	return arr[0];
};

util.tail = function (arr) {
	return arr.slice(1);
};

util.makeAsker = function(stdin, stdout) {
	return function (prompt, callback) {
		stdin.resume();
		stdout.write(prompt + ": ");

		stdin.once('data', function(data) {
			data = data.toString().trim();
			callback(data);
		});
	};
};

module.exports = util;