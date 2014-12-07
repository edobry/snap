$(function() {
	$("#login").submit(function() {
		var user = $("#user").val();
		var pass = $("#pass").val();

		console.log("username: " + user);
		console.log("password: " + pass);

		return false;
	});
});