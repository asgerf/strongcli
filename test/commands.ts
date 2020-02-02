import tape = require('tape');
import * as cli from 'strongcli';

interface AddOptions {
    type?: string;
    count?: number;
}
interface RemoveOptions {
    type?: string;
    count?: number;
    force?: boolean;
}
type Handler<T> = (opts: T, args: string[]) => void
function doNothing() {
    // do nothing
}

function makeParser(callbacks: { add?: Handler<AddOptions>; remove?: Handler<RemoveOptions> } = {}) {
    let { add = doNothing, remove = doNothing } = callbacks;
    let program = cli.program('test').commandSet();

    program.command<AddOptions>({
        name: 'add',
        description: 'Adds new things',
        options: {
            type: {
                value: String
            },
            count: {
                value: Number
            }
        },
        helpIfEmpty: true,
        callback(options, args) {
            add(options, args);
        },
    });

    program.command<RemoveOptions>({
        name: 'remove',
        options: {
            type: {
                value: String,
                description: 'type of thing to remove'
            },
            count: {
                value: Number
            },
            force: {}
        },
        helpIfEmpty: true,
        callback(options, args) {
            remove(options, args);
        }
    });
    return program;
}

tape('help', t => {
    let program = makeParser();
    t.equal(program.getHelp(), `
Usage: test command [<args>]

Commands:
    help <cmd>    Show help for a command
    add           Adds new things
    remove        
`);
    t.end();
});

tape('help add', t => {
    let program = makeParser();
    t.equal(program.getSubcommand('add').getHelp(), `
Usage: test add [options]

Adds new things

Options:
    --type <value>       
    --count <num>        
`);
    t.end();
});

tape('help remove', t => {
    let program = makeParser();
    t.equal(program.getSubcommand('remove').getHelp(), `
Usage: test remove [options]

Options:
    --type <value>       type of thing to remove
    --count <num>        
    --force              
`);
    t.end();
});

tape('add', t => {
    makeParser({
        add: (options, args) => {
            t.deepEqual(options, {type: 'tea', count: 45});
            t.deepEqual(args, ['baz']);
        },
        remove: () => {
            t.fail();
        }
    }).execute(['add', '--type', 'tea', '--count', '45', 'baz']);
    t.end();
});

tape('remove', t => {
    makeParser({
        add: () => {
            t.fail();
        },
        remove: (options, args) => {
            t.deepEqual(options, {type: 'tea', count: 45, force: true});
            t.deepEqual(args, ['baz']);
        }
    }).execute(['remove', '--type', 'tea', '--count', '45', 'baz', '--force']);
    t.end();
});
