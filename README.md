# Cookie Log Analyser

`cookie-analyser` processes a cookie log file and returns the most active cookie for a specific day.

## Usage

```bash
cookie-analyser -f <filename> -d <date>
```

### Parameters

- -f <filename>: Specifies the path to the cookie log file.

- -d <date>: Specifies the date in the format 'YYYY-MM-DD' for which you want to find the most active cookie.

## Example

To find the most active cookie for December 9th, 2018, run the following:


```bash
cookie-analyser -f cookie_log.csv -d 2018-12-09
```

## Input File Format

The input file should be in CSV format with two columns: cookie and timestamp. For example:

```
AtY0laUfhglK3lC7,2018-12-09T14:19:00+00:00
SAZuXPGUrfbcn5UA,2018-12-09T10:13:00+00:00
5UAVanZf6UtGyKVS,2018-12-09T07:25:00+00:00
AtY0laUfhglK3lC7,2018-12-09T06:19:00+00:00
SAZuXPGUrfbcn5UA,2018-12-08T22:03:00+00:00
4sMM2LxV07bPJzwf,2018-12-08T21:30:00+00:00
fbcn5UAVanZf6UtG,2018-12-08T09:30:00+00:00
4sMM2LxV07bPJzwf,2018-12-07T23:30:00+00:00
```


## Output

The script will write the most active cookie for the specified date to stdout. So for the example file above:

```bash
$ cookie-analyser -f cookie_log.csv -d 2018-12-09
AtY0laUfhglK3lC7
```

## Notes

- The most active cookie is defined as the cookie seen in the log the most times during the given day.
- If there are multiple cookies with the same maximum count, all of them will be printed.
- If no cookie is found for the given date, the script will output nothing.


## Requirements

This script requires a Unix-like environment with Bash installed.
