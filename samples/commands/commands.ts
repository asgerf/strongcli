import * as cli from '@asgerf/strongcli';

let program = cli.program('commands').commandSet();

export interface AddOptions {
    type?: string;
    count: number;
}
program.command<AddOptions>({
    name: 'add',
    description: 'Adds new things',
    options: {
        type: {
            value: String
        },
        count: {
            value: Number,
            default: 0
        },
    },
    helpIfEmpty: true,
    callback(options, args) {
        console.log(`Adding ${options.count} of ${options.type} and also: ${args.join(', ')}`);
    },
});

export interface RemoveOptions {
    type: string;
    count: number;
    force: boolean;
}
program.command<RemoveOptions>({
    name: 'remove',
    options: {
        type: {
            value: String,
            default: cli.required
        },
        count: {
            value: Number,
            default: 0
        },
        force: {}
    },
    helpIfEmpty: true,
    callback(options, args) {
        console.log(`Removing ${options.count} of ${options.count} (force=${options.force}) and also: ${args}`);
    }
});

program.main();
