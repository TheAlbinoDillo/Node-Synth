const actions = root_require("actions.js");

function run (options)
{
  actions.send(options, options.full);
}

module.exports =
{
  name: "Echo",
  perms: ["ADMINISTRATOR"],
  run: run
};
