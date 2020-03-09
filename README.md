# strongcli

A convenient but strict command-line parser with strong type checking for TypeScript.

## Highlights
- Options never have unexpected types.
- Helpful error messages and usage text.
- Easy transition to subcommands if so desired.
- No dependencies.

## Install
```bash
$ npm install strongcli
```

## Usage
```typescript
import * as cli from 'strongcli';

interface Options {
    name?: string;
    count?: number;
}

let { options, args } = cli.main<Options>({
    name: { value: String },
    count: { value: Number }
});
```

## More examples
```typescript
import * as cli from 'strongcli';

interface Options {
    names: string[];
    count: number;
    force: boolean;
}

let { options, args } = cli.main<Options>({
    name: {
        value: String,
        repeatable: true, // can be repeated, always maps to an array
    },
    count: {
        value: Number, // Parses the value of the option
        alias: '-c',   // Examples: --count 5 --count=5 -c 5 -c5
        default: 1,    // Set to 1 if not specified.
    },
    force: {}          // no args needed for boolean flags
});

console.log(options.names.join(', '));
```

## Type checking

By passing your `Options` interface as a type argument to `cli.main`, the
object literal you pass in will be checked.

For example, the following errors are found at compile-time:
```typescript
interface Options {
    foo?: string;
    bar?: number;
    baz: number[];
}
cli.main<Options>({
    foo: {
        value: Number; // Error: expected return type 'string'
    },
    bar: {
        value: Number;
        repeatable: true; // Error: type of 'bar' is not an array
    },
    baz: {
        value: Number;
        repeatable: true; // OK
    }
})
```

## Configuration

Instead of calling `cli.main` directly, you can prefix it with calls to `program` and/or `parser`:
```typescript
cli.main();                    // for lazy people
cli.parser().main();           // create parser separately
cli.program().parser().main(); // configure parser first
```

For example:
```typescript
let parser = cli.program('myprogram').parser<Options>({
    foo: {
        value: String
    }
});
let { options, args } = parser.main();
if (args.length === 0) {
    parser.help();
}
```

If you don't want strongcli to call `process.exit` or print directly to the console, avoid calling `main` and `help`, instead use `parse` and `getHelp`:
```typescript
parser.main();  // on error, print and exit
parser.help();  // print and exit

parser.parse();   // on error, throw exception
parser.getHelp(); // return a string
```

# Subcommands

To use subcommands, call `.commandSet()`:
```typescript
cli.commandSet()
cli.program().commandSet()
```

Then follow with `.command()` and `.main()`. For example:
```typescript
let program = cli.commandSet();

interface AddOptions {
    name?: string;
    count?: number;
}
program.command<AddOptions>({
    name: 'add',
    options: {
        name: {
            value: String,
        },
        count: {
            alias: '-c',
            value: Number,
        },
    },
    callback(options, args) {
        /* execute 'add' command */
    }
});

/* ... more program.command() calls ... */

program.main();
```

# Defaults

Set `default` to the value to use for an option that was omitted:
```typescript
interface Options {
    baseDir: string;
}
let { options, args } = cli.main<Options>({
    baseDir: {
        value: String,
        default: '.'
    }
})
```

If no default is specified, value options will be `undefined`, flags will be `false`,
and repeatable value options will be empty arrays.

The default can also be a function creating the default value:
```typescript
interface Options {
    pathMappings: Map<string, string>;
}
let { options, args } = cli.main<Options>({
    baseDir: {
        value: s => parsePathMappings(s),
        default: () => new Map()
    }
})
```

# Required options

To mark an option as required, set its default to `cli.required`:
```typescript
interface Options {
    name: string;
}
let { options, args } = cli.main<Options>({
    name: {
        value: String,
        default: cli.required
    }
});
```

# Strict mode

If using TypeScript in strict mode, all value options must have a type that permits `undefined` (possibly by being optional) or have a `default` value.
The default value can be `cli.required` (see above).

```typescript
interface Options {
    foo: string;
    bar?: string;
    baz: boolean;
}
let { options, args } = cli.main<Options>({
    foo: {
        value: String,
        default: cli.required
    },
    bar: {
        value: String,
        // doesn't need a default as type is `bar?: string`
    },
    baz: {} // flags don't need to be marked as required
});
```

Repeatable options need no default as they default to an empty array.
