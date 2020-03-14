import tape = require('tape');
import { OptionParser } from '@asgerf/strongcli';

tape('simple options', t => {
    interface Options {
        name?: string;
        portNumber?: number;
    }
    let parser = new OptionParser<Options>({
        name: {
            value: String
        },
        portNumber: {
            value: Number
        },
    });
    t.deepEqual(parser.parse(['--name', 'foo', '--port-number', '45']).options, {
        name: 'foo',
        portNumber: 45
    });
    t.deepEqual(parser.parse(['--name=foo', '--port-number=45']).options, {
        name: 'foo',
        portNumber: 45
    });
    t.end();
});

tape('short options', t => {
    interface Options {
        name?: string;
        portNumber?: number;
    }
    let parser = new OptionParser<Options>({
        name: {
            value: String,
            alias: '-n'
        },
        portNumber: {
            value: Number,
            name: '-p'
        },
    });
    t.deepEqual(parser.parse(['--name', 'foo', '-p45']).options, {
        name: 'foo',
        portNumber: 45
    });
    t.deepEqual(parser.parse(['-nfoo', '-p', '45']).options, {
        name: 'foo',
        portNumber: 45
    });
    t.throws(() => {
       parser.parse(['--port-number', '45']);
    }, /--port-number/);
    t.end();
});

tape('positional arguments', t => {
    interface Options {
        name?: string;
        portNumber?: number;
    }
    let parser = new OptionParser<Options>({
        name: {
            value: String
        },
        portNumber: {
            value: Number
        },
    });
    t.deepEqual(parser.parse(['pos0', '--name', 'foo', 'pos1', '--port-number', '45', 'pos2']), {
        options: {
            name: 'foo',
            portNumber: 45
        },
        args: ['pos0', 'pos1', 'pos2']
    });
    t.deepEqual(parser.parse(['pos0', '--name', 'foo', 'pos1', '--port-number=45', 'pos2']), {
        options: {
            name: 'foo',
            portNumber: 45
        },
        args: ['pos0', 'pos1', 'pos2']
    });
    t.end();
});

tape('repeatable options', t => {
    interface Options {
        names?: string[];
        portNumbers?: number[];
    }
    let parser = new OptionParser<Options>({
        names: {
            name: '--name',
            value: String,
            repeatable: true
        },
        portNumbers: {
            name: '--port-number',
            value: Number,
            repeatable: true
        },
    });
    t.deepEqual(parser.parse(['--name', 'foo', '--port-number', '45', '--name', 'bar', '--port-number', '47']).options, {
        names: ['foo', 'bar'],
        portNumbers: [45, 47]
    });
    t.deepEqual(parser.parse(['--name', 'foo', '--name', 'bar']).options, {
        names: ['foo', 'bar'],
        portNumbers: []
    });
    t.end();
});

tape('repeatable options default', t => {
    interface Options {
        names?: string[];
        portNumbers: number[];
    }
    let parser = new OptionParser<Options>({
        names: {
            name: '--name',
            value: String,
            repeatable: true
        },
        portNumbers: {
            name: '--port-number',
            value: Number,
            repeatable: true,
            default: [8000]
        },
    });
    t.deepEqual(parser.parse(['--name', 'foo', '--name', 'bar']).options, {
        names: ['foo', 'bar'],
        portNumbers: [8000]
    });
    t.end();
});

tape('consume multiple arguments', t => {
    interface Options {
        names: string[];
        portNumbers: number[];
    }
    let parser = new OptionParser<Options>({
        names: {
            name: '--name',
            value: String,
            consumeMultipleArguments: true
        },
        portNumbers: {
            name: '--port-number',
            value: Number,
            consumeMultipleArguments: true
        },
    });
    t.deepEqual(parser.parse(['--name', 'foo', 'bar', 'baz', '--port-number', '123', '456']).options, {
        names: ['foo', 'bar', 'baz'],
        portNumbers: [123, 456]
    });
    t.deepEqual(parser.parse(['--name=foo', 'bar', 'baz', '--port-number', '123', '456']), {
        options: {
            names: ['foo'],
            portNumbers: [123, 456],
        },
        args: ['bar', 'baz']
    });
    t.end();
});

tape('consume all arguments', t => {
    interface Options {
        names: string[];
        portNumbers: number[];
    }
    let parser = new OptionParser<Options>({
        names: {
            name: '--name',
            value: String,
            consumeMultipleArguments: 'all'
        },
        portNumbers: {
            name: '--port-number',
            value: Number,
            consumeMultipleArguments: true
        },
    });
    t.deepEqual(parser.parse(['--name', 'foo', 'bar', 'baz', '--port-number', '123', '456']).options, {
        names: ['foo', 'bar', 'baz', '--port-number', '123', '456'],
        portNumbers: []
    });
    t.end();
});

tape('consume multiple arguments, repeatable', t => {
    interface Options {
        names: string[][];
        portNumbers: number[];
    }
    let parser = new OptionParser<Options>({
        names: {
            name: '--name',
            value: String,
            consumeMultipleArguments: true,
            repeatable: true
        },
        portNumbers: {
            name: '--port-number',
            value: Number,
            repeatable: true
        },
    });
    t.deepEqual(parser.parse(['--name', 'foo', 'bar', 'baz', '--port-number', '123', '--name', 'bar']).options, {
        names: [['foo', 'bar', 'baz'], ['bar']],
        portNumbers: [123]
    });
    t.end();
});

tape('consume multiple arguments, default', t => {
    interface Options {
        names: string[][];
    }
    let parser = new OptionParser<Options>({
        names: {
            name: '--name',
            value: String,
            consumeMultipleArguments: true,
            repeatable: true,
            default: [['x'], ['y']],
        },
    });
    t.deepEqual(parser.parse([]).options, {
        names: [['x'], ['y']],
    });
    t.deepEqual(parser.parse(['--name', 'x']).options, {
        names: [['x']],
    });
    t.end();
});
