"use strict";

var logged_in = false;

const connect = (client, token, time = 3) =>
{
	if (logged_in) return;

	console.log("Connecting to Discord...");

	client.login(token).then( () =>
	{
		console.log("  Logged in.\n");

	}).catch( (error) =>
	{
		console.log
		(
			"\tFailed to connect:\n\n",
			`\t\t${error.message}\n\n`,
			`\tTrying again in ${time} second(s).\n`
		);
		client.setTimeout( () =>
		{
			connect(client, token, 30);

		}, time * 1000);
	});
};

module.exports = connect;