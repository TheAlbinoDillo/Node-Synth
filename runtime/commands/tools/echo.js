const actions = script_require("actions.js");

function run (options)
{
  actions.send(options, options.full);
  options.message.delete().catch();
}

module.exports =
{
  name: "Echo",
  perms: ["ADMINISTRATOR"],
  run: run
};
