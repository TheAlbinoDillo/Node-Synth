"use strict";

//Import libraries
//////////////////////////////////////////////////////////////////////////////////
const fs = require("fs");

//////////////////////////////////////////////////////////////////////////////////
String.endsWith = (suffix) =>
{
	return this.indexOf(suffix) === this.length - suffix.length;
};

this.list_dir = (path) =>
{
	let dir = fs.readdirSync(path);

	let contents =
	{
		files: [],
		folders: []
	};

	dir.forEach( async (element) =>
	{
		let subpath = `${path}/${element}`;
		let stat = fs.lstatSync(subpath);

		let obj =
		{
			filename: element,
			path: subpath,
			path_up: path
		};

		if (stat.isDirectory() )
		{
			contents.folders.push(obj);
			return;
		}
		if (stat.isFile() )
		{
			contents.files.push(obj);
			return;
		}
	});
	return contents;
};