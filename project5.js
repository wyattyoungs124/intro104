/*
HappyTunes is a progressive web application for
downloading music files. Each time a file is purchased,
a transaction record is created that includes the music genre and price paid.
The available genres are Classical, Easy Listening, Jazz, Pop, Rock, and Other.
Develop an application that accepts input data for each transaction and displays a report that lists each of the music genres,
along with a count of the number of purchases in each of the following price categories:

Over $10.00
$6.00 through $9.99
$3.00 through $5.99
Under $3.00

It should have the ability to sort by most downloaded genre.

REWORDED:
When the program starts, users can pick a genre, and then choose their own price to pay for a song. Record the Genre choice and the price paid, associating the price with the genre. You must be able to sort the Genres by most downloaded.

Additionally, each time a transaction is registered a counter must be added to the relevant price bracket. IE, you want to track how many purchases were over $10 regardless of genre, etc.
 */
//section 1
"use strict";
const REF = require('./reflib');

//section 2
const GENRES = ['Classical', 'Easy Listening', 'Jazz', 'Pop', 'Rock', 'Other'];

let sortGenres = GENRES;

let genrePrice = new Map();
let currentGenre;

let overTen = 0;
let sixTen = 0;
let threeSix = 0;
let underThree = 0;

let keepRunning = 1;

// Section 3
function main(){
    loadGenres();
    while(keepRunning) {
        runMenu();
    }

}



main();
//section 4

function buyMenu(){
    let keepBuying = 1;

    while(keepBuying) {
        console.log("-----Please select a genre-----");
        console.log("(1.)--------Classical----------");
        console.log("(2.)------Easy-Listening-------");
        console.log("(3.)----------Jazz-------------");
        console.log("(4.)----------Pop--------------");
        console.log("(5.)----------Rock-------------");
        console.log("(6.)----------Other------------");
        console.log("-------------------------------");

        // Setting this to 0. Only if Default runs is it restored to 1.
        keepBuying = 0;
        switch (REF.inputPosNumber("-------Choice-Selection------:  ")) {
            case 1:
                currentGenre = genrePrice.get('Classical');
                break;
            case 2:
                currentGenre = genrePrice.get('Easy Listening');
                break;
            case 3:
                currentGenre = genrePrice.get('Jazz');
                break;
            case 4:
                currentGenre = genrePrice.get('Pop');
                break;
            case 5:
                currentGenre = genrePrice.get('Rock');
                break;
            case 6:
                currentGenre = genrePrice.get('Other');
                break;
            default:
                keepBuying = 1;
                console.log("ERROR: Invalid selection!");
                break;
        }

    }
    // Purchases.
    let price = REF.inputPosNumber(`Enter-desired-price:  `);
    switch(true) {
        case price > 10:
            overTen++;
            break;
        case price >= 6:
            sixTen++;
            break;
        case price >= 3:
            threeSix++;
            break;
        default:
            underThree++;
            break;
    }
    currentGenre.push(price);
    doSort();
    console.log('---Thank-you-for-your-purchase!---');
}

function sortByDownloads(a, b) {
    return genrePrice.get(b).length - genrePrice.get(a).length;
}

function doSort() {
    sortGenres.sort(sortByDownloads);
}

function viewData(){
    console.log(genrePrice);
    console.log("Most Downloaded: ");
    for(let gen of sortGenres) {
        console.log(`${gen}: ${genrePrice.get(gen).length} Downloads!`);
    }
    console.log("-------Price-Brackets-------");
    console.log(`---(Over-$10): ${overTen}---`);
    console.log(`---($6-$10): ${sixTen}---`);
    console.log(`---($3-$6):  ${threeSix}---`);
    console.log(`---(Under-$3): ${underThree}---`);


}

function runMenu(){
    console.log("----Please-make-a-selection----");
    console.log("(1.)-------Buy-A-Song----------");
    console.log("(2.)-View-Transaction-Data-----");
    console.log("(3.)------Exit-Program---------");
    console.log("-------------------------------");

    switch(REF.inputPosNumber("-------Choice-Selection------:  ")) {
        case 1:
            buyMenu();
            break;
        case 2:
            viewData();
            break;
        case 3:
            keepRunning = 0;
            break;
        default:
            console.log("ERROR:---Invalid-Choice!---");
            break;
    }
}



function loadGenres() {
    for(let gen of GENRES) {
        genrePrice.set(gen, []);
    }
}