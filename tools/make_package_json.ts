import * as fs from "fs";
import * as cli from "@asgerf/strongcli";

let program = cli.program({
    usage: `
Usage: make_package_json <package.json>

Removes unneeded parts of the given package.json file and prints the result to stdout.
`,
    helpIfEmpty: true
});

let { args } = program.main({});

let filename = args[0];

let json = JSON.parse(fs.readFileSync(filename, 'utf8'));
let clearNames = ['scripts', 'main', 'typings']
for (let name of clearNames) {
    json[name] = undefined;
}

console.log(JSON.stringify(json, undefined, 4));
