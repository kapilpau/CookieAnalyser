# Bash solution

## Explanation

There are two main sections to this implementation, the flags handler and the core logic. These sections are in their own files (`cookie-analyser` and `internal/cookie-analyser.js`). The reason for this separation is that if these were merged into one file, when the tests attempt to import the `analyseCookies` function, the `main` function will be run and throw an error because the required flags weren't supplied.

### Flags

This implementation uses the [`commander`](https://www.npmjs.com/package/commander) library for handling the command line arguments for `filename` and `date`:

```javascript
    commander
        .usage('[OPTIONS]...')
        .requiredOption('-f <value>', 'Cookie log to analyse.')
        .requiredOption('-d <value>', 'Date to search for.')
        .parse(process.argv);

    const options = commander.opts();
    analyseCookies(options.filename, options.date);
```

This code block configures `commander` to require the two required flags (`-f` and `-d`) and parses the `process.argv` variable, which contains the arguments supplied to the `node` command when the CLI is run. `commander` automatically handles if a required option isn't supplied and adds a `help` flag through the `usage` function.

`commander.opts()` returns the options in the form of a map, which is then used to pass the options to the `analyseCookies` function.


### Core logic

The core functionality of the CLI is implemented in `internal/cookie-analyser.js`. 

```js
    try {
        
        const lines = fs.readFileSync(filename, 'utf8').split("\n");
        ...        
    } catch (err) {
        if (err.code && err.code === 'ENOENT') {
            console.error('File not found!');
            process.exit(127);
        } else {
            throw err;
        }
    }
```

The above code uses the `fs` package to reads in the supplied file and stores the output in the `lines` variable. If there is a problem reading the file, `readFileSync` throws an error, which is caught by the `catch` block. This block will check if the error is because the file doesn't exist, and if so emits an appropriate message. If it's not because the file doesn't exist, then the CLI will surface that error, as it's unexpected and cannot be handled elegantly.

```js
    let foundDate = false;
    for (const line of lines) {
        const [cookie, date] = line.trim().split(",");
        
        if (!date.includes(dateArg)) {
            if (foundDate) {
                break;
            }
        } else {
            foundDate = true;

            if (!(cookie in cookieCounts)) {
                cookieCounts[cookie] = 0;
            }

            cookieCounts[cookie]++;
        }
    }
```

This code block exists in the try block above, but was hidden from the explanation above for readability reasons. This logic loops through each line of the log file, splits it into two parts (`cookie` and `date`), and checks if the date is the one that is requested. If the date is the specified one, then it sets `foundDate` to true, creates an entry in the map of `cookie` to `count` if it's not already there, and then increments the count for that `cookie`. If it's not, then it checks if the date has already been found, and exits the for loop if it has. The reason for doing this is the log lines are in chronological order so if the date has already been found and the loop has reach a different date, it will never find the requested date again, so it can save some time.

```js
    let maxFound = 0;
    let maxFoundCookies = [];

    for (const cookie in cookieCounts) {
        if (cookieCounts[cookie] > maxFound) {
            maxFound = cookieCounts[cookie];
            maxFoundCookies = [cookie];
        } else if (cookieCounts[cookie] === maxFound) {
            maxFoundCookies.push(cookie);
        }
    }

    if (maxFoundCookies.length > 0) {
        console.log(maxFoundCookies.sort().join("\n"))
    }
```

This code loops through all of the cookies found for the specified date, compares the count with the `maxFound` variable, which stores the count of the most active cookie found so far. If the count being compared is greater than `maxFound` then it updates `maxFound` and updates `maxFoundCookies`, which is an array of all of the cookies that have been found `maxFound` number of times, to be a single element array of the current cookie. If the count equals `maxFound` then it pushes the cookie to `maxFoundCookies`.

Finally, if the number of cookies found is greater than 0, then it prints each of those cookies out on a new line.

## Tests

To ensure that the cookie-analyser CLI functions correctly, I have implemented unit tests using the [jest](https://jestjs.io/) framework. Jest is an industry standard testing framework and can be running with the following command:

```bash
$ npm run test

> cookie-analyser@1.0.0 test
> jest --coverage

 PASS  internal/tests/cookie-analyser.test.js
  ✓ no cookies for specified day returns empty (1 ms)
  ✓ stand out cookie for day returns single output
  ✓ stand out cookie for day returns single output
  ✓ no existent file returns 127

--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   96.66 |    93.75 |     100 |   96.66 |
 cookie-analyser.js |   96.66 |    93.75 |     100 |   96.66 | 35
--------------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        0.235 s
Ran all test suites.
```

**Note**: There is one uncovered line here, which throws an unexpected error. This could be tested using mocks, however, doing so would introduce additional tests and bloat for a rare edge-case that simply throws an error.