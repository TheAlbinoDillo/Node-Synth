class Command
{
	constructor (options)
	{
		this.name = options.name || `Command ${Date.now()}`;
		this.desc = options.desc || `Run ${this.name}!`;

		let run_function = async () => {return this.name + "!"};
		this.run = async (o)=>
		{
			let start = Date.now();

			let result = await options.run(o);

			let time = Date.now() - start;

			console.log(`Ran "${this.name}" for ${o.author.username} in ${time}ms.\n`);
			return result;
		};

		//this.run = options.run || run_function;

		let call_name = this.name.toLowerCase().replace(/\s/g, "");
		this.calls = options.calls || [call_name];

		this.perms = options.perms || ["BOT_OWNER"];

		this.category = options.category;

		command_list.add(this);

		console.log(`\t\tLoaded ${this.name}\tfg ${this.calls}`);
		console.log(`\t\t${this.desc}\n`);
	}
}