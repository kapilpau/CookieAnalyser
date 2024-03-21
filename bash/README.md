# Bash solution


## Explanation

The logic for the core of this tool is quite trivial, with the main complexity arising from the need to support returning multiple cookies. Below, I will explain what it all does:

```bash
while getopts d:f: flag
do
    case "${flag}" in
        d) date=${OPTARG};;
        f) filename=${OPTARG};;
        ?) echo "Usage: cookie-analyser -f /path/to/log.csv -d YYYY-MM-DD."; exit 1;;
    esac
done
```

`getopts` is the standard for command line arguments on Bash scripts. To use it, you specify which flags are supported and by add `:` after each flag, it indicates that the flag requires an argument. The case statement then stores the arguments in variables and errors if an unexpected flag is provided.

```bash
if [ -z "$filename" ]
then
  echo "Missing -f, please specify the file to analyse"
  exit 1
fi

if [ -z "$date" ]
then
  echo "Missing -d, please specify the date to search for"
  exit 1
fi
```

The above code is required as `getopts` does not support required parameters, so the script has to enforce this itself. `if [ -z "" ]` returns true, so if no argument is provided, then `"$filename"` or `"$date"` will resolve to `""` and therefore the if condition will evaluate to true and the error will be thrown.


```bash
lines=$(cat $filename | grep ",$date" | awk -F',' '{print $1}' | sort | uniq -c | sort -rn)
```

This line contains the core logic for the tool so I will break down each section. The `|` character passes the output of one command to the input of the next, so that is how data is being passed through.

`cat $filename` - simply prints out the contents of the specified file to stdout.

`grep ",$date"` - filters the output that is passed to it so only prints out the lines that contain a comma followed by the date supplied, as this is the structure that it would be present in the file as. The comma is not necessarily needed, however, it doesn't harm to include it.

`awk -F',' '{print $1}'` - splits each line on every comma and prints the first element of the resultant array

`sort` - sorts the output

`uniq -c` - prints the number of times each line is printed consecutively. This is why the sort is needed, because the repeated lines need to be grouped together

`sort -rn` - sorts again, but this time is sorting based on the count from above, as that is the start of each line

All of that means that the `lines` variable contains a string that looks like:

```
   2 AtY0laUfhglK3lC7
   1 SAZuXPGUrfbcn5UA
   1 5UAVanZf6UtGyKVS
```

```bash
max_occurence=$(echo "$lines" | head -n 1 | awk -F' ' '{print $1}')
```

The line above gets the count for the first line, as this will be the highest count from the `sort` command above. This variable will be used later.


```bash
IFS=$'\n'
for line in $(echo "$lines")
do

  count=$(echo $line | awk -F' ' '{print $1}')
  cookie=$(echo $line | awk -F' ' '{print $2}')

  if [ "$count" != "$max_occurence" ]
  then
    exit 0
  else
    echo $cookie
  fi

done
```

Finally, this block splits the multiline string in `lines` on the return character, splits each line into `cookie` and `count`, and if the `count` is the same as the `max_occurence`, then it will print the `cookie` id, otherwise the program will end. The reason for ending here is that once the `count` no longer equals the `max_occurence`, the subsequent lines will all exist fewer times and so it is unnecessary to process them.

## Tests

To ensure that the cookie-analyser CLI functions correctly, I have implemented unit tests using the [Bats](https://github.com/bats-core/bats-core) framework. Bats is a TAP-compliant testing framework and can be running with the following command:

```bash
$ tests/bats/bin/bats tests/tests.bats
tests.bats
 ✓ can run the script
 ✓ no cookies for specified day returns empty
 ✓ stand out cookie for day returns single output
 ✓ two equal cookies for day returns two outputs

4 tests, 0 failures
```