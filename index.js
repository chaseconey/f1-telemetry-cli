#!/usr/bin/env node

require("yargs/yargs")(process.argv.slice(2))
  .command(require("./cmds/record"))
  .command(require("./cmds/process"))
  .command(require("./cmds/session"))
  .help().argv;
