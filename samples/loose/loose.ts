import * as cli from 'strongcli';

export interface Options {
    thing: string[][];
    times: number;
    other?: boolean;
}

let parser = cli.program('hello').parser<Options>({
    thing: {
        name: ['-b', '--bar'],
        value: String,
        consumeMultipleArguments: true,
        repeatable: true,
        description: 'A thing'
    },
    times: {
        value: cli.integer,
        description: 'Number of times to do something.\nDefault: 3'
    },
});

console.log(parser.getHelp());

let parsed = parser.main();

console.dir(parsed);
