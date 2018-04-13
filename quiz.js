const FS = require('fs');
const PROMPT = require('readline-sync');

function main() {

    let files = FS.readdirSync('.');

    for(let i = 0; i < files.length; i++) {
        console.log(files[i]);
    }

    for(let file of files) {
        console.log(file);
    }

}

main();