const fs = require("fs")

const analyseCookies = (filename, dateArg) => {

    let cookieCounts = {};


    try {
        
        const lines = fs.readFileSync(filename, 'utf8').split("\n");
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
        
    } catch (err) {
        if (err.code && err.code === 'ENOENT') {
            console.error('File not found!');
            process.exit(127);
        } else {
            throw err;
        }
    }

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

}


module.exports = {
    analyseCookies
}