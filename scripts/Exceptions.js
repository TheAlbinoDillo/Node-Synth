"use strict";

const fs = require("fs.promises");

process.on("uncaughtException", async (error) =>
{
	let message = `${Date.now()}\n${error.stack}`;
	console.error(error);

	fs.writeFile("error_log.txt", message);
	process.exit(1);
});

process.on("unhandledRejection", async (reason, promise) =>
{
	console.error(reason.stack);
	
	fs.writeFile("error_log.txt", reason.stack);
	process.exit(1);
});

module.exports = null;