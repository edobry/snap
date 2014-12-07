$(function() {
	$("#login").submit(function() {
		var user = $("#user").val();
		var pass = $("#pass").val();

		console.log("username: " + user);
		console.log("password: " + pass);

		$.ajax({
			type: "POST",
			url: "/login",
			contentType: "application/json",
			data: JSON.stringify({ user: user, pass: pass })
		}).done(console.log);

		return false;
	});
});