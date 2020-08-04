import * as cli from '@asgerf/strongcli';

enum Format {
    html = 'html',
    markdown = 'markdown',
}

export interface Options {
    thing: string[][];
    times: number;
    other?: boolean;
    format: Format;
}

let parser = cli.program('hello').parser<Options>({
    thing: {
        name: ['-b', '--bar'],
        value: String,
        consumeMultipleArguments: true,
        repeatable: true,
        description: 'A thing',
        default: cli.required
    },
    times: {
        value: cli.integer,
        description: 'Number of times to do something.\nDefault: 3',
        default: cli.required
    },
    format: {
        value: cli.oneOf(Format),
        description: `Format to use.\nCan be one of ${Object.keys(Format).join(', ')}.\nDefault is 'html'.`,
        default: Format.html,
    }
});

console.log(parser.getHelp());

let parsed = parser.main();

console.dir(parsed);
