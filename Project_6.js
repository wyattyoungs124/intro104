/*
The Curl Up and Dye Beauty Salon maintains a master file that contains a record for each of its clients. Fields in the master file include the client's ID number, first name, last name, and total amount spent this year. Every week, a transaction file is produced. It contains a customer's ID number, the service received (for example, Manicure), and the price paid. Each file is sorted in ID number order. Write a program that matches the master and transaction file records and updates the total paid for each client by adding the current week's price paid to the cumulative total. Not all clients purchase services each week. The output is the updated master file and an error report that lists any transaction records for which no master record exists. Output a coupon for a free haircut each time a client exceeds $750 in services. The coupon, which contains the client's name and an appropriate congratulatory message, is output during the execution of the update program when a client total surpasses $750.
 */

//section 1
"use strict";
const REF = require('./reflib');
const IO = require('fs'); // For file I/O

//section 2
let runProgram = 1;
let clients = new Map();
let trans = new Map();

//Classes
class User {
    constructor(id,first,last){
        this.id = id;
        this.firstName = first;
        this.lastName = last;
        this.transactions = new Map();
        this.coupon = 0;
    }

    total() {
        let output = 0;
        for(let tran of this.transactions.values()) {
            output += tran.price;
        }
        return output;
    }
}

class Invoice {
    constructor(id, userID, service, price, week) {
        this.id = id;
        this.userID = userID;
        this.service = service;
        this.price = price;
        this.week = week;
    }
}

//section 3
function main () {
    while(runProgram) {
    startCurlUp();
    }
}

//section 4
main();

function startCurlUp() {
    console.log("*****************MAIN*MENU****************");
    console.log("]][[-*1*-]][[Add--New--Client]][[-*1*-]][[");
    console.log("]][[-*2*-]][Service--Archive]]][[-*2*-]][[");
    console.log("]][[-*3*-]][[Add--A--Service]]][[-*3*-]][[");
    console.log("]][[-*4*-]][Save--All--Data]]][[[-*4*-]][[");
    console.log("]][[-*5*-]][Load--All--Data]]][[[-*5*-]][[");
    console.log("]][[-*6*-]][[[Exit--Program]]]][[-*6*-]][[");
    console.log("******************************************");

    switch(REF.inputPosNumber("]][]]][[]][[Choice--Selection]][[]][[]=>  ")){
        case 1:
            newClient();
            break;
        case 2:
            displayData();
            break;
        case 3:
            addService();
            break;
        case 4:
            saveData();
            break;
        case 5:
            loadData();
            break;
        case 6:
            runProgram = 0;
            console.log("Goodbye!");
            break;
        default:
            console.log("ERROR: Invalid Choice, Try again.");
            break;
    }
}

//Listed below are all of the menu functions.

function newClient() {
    let id = REF.inputNumber("************Enter**new**id**number******=>  ");
    if(clients.has(id)) {
        console.log("ERROR: ID already in use!");
        return;
    }
    let firstName = REF.inputString("************Enter--First--Name**********=>  ");
    let lastName = REF.inputString ("************Enter--Last--Name***********=>  ");
    clients.set(id, new User(id, firstName, lastName));
}

function loadData() {

        // Clear out global variables. Just in case.
        clients = new Map();
        trans = new Map();

        // Create file handle to our save file.
        let dataFile = IO.readFileSync(`data/curlClient.csv`, 'utf8');

        // Read in the text from the datafile. Split it into an array based on new lines.
        // Each line = an element of the array.
        let lines = dataFile.toString().split(/\r?\n/);

        // Loop over each line of the save file...
        for (let line of lines) {
            // The if check makes sure that we only load if the line has any data in it.
            if(line) {
                // Split the line by commas. This separates user id, first name, last name, etc.
                let data = line.toString().split(/,/);

                // Convert the data into appropriate types (eg, Number()), create User object, put it into the clients map.
                clients.set(Number(data[0]), new User(Number(data[0]),data[1],data[2]));
            }
        }

        // Now we'll load transactions.
    dataFile = IO.readFileSync(`data/curlTrans.csv`,  'utf8');
    lines = dataFile.toString().split(/\r?\n/);

    for(let line of lines) {
        if(line) {
            let client = clients.get(Number(data[1]));
            if(client) {
                let data = line.toString().split(/,/);
                let new_trans = new Invoice(Number(data[0]),Number(data[1]),data[2],Number(data[3]),Number(data[4]));
                trans.set(new_trans.id, new_trans);
                client.transactions.set(new_trans.id, new_trans);
            }
            else {
                console.log(`Could not load Transaction ${data[0]}. Client not found.`);
            }
        }
    }

}

function addService() {
    let curUser = clients.get(REF.inputPosNumber("************Enter--customer--ID--number**=>  "));
    if (!curUser) {
        console.log("ERROR: customer ID does not exist! ");
        return;
    }
    let goodid = false, invoiceID;

    while(!goodid) {
        invoiceID = REF.inputPosNumber("************Enter--invoice--ID--number**=>  ");
        if(!trans.has(invoiceID)) {
            goodid = true;
        }
        else {
            console.log("Invoice ID already used. Please try again.");
        }
    }
    let serv = REF.inputString("************Enter--given--service**=>  ");
    let week = REF.inputPosNumber("************Enter--current--week--number**=>  ");
    let price = REF.inputPosNumber("************Enter--purchase--price**=>  ");

    let new_invoice = new Invoice(invoiceID, curUser.id, serv, price, week);
    curUser.transactions.set(invoiceID, new_invoice);
    trans.set(invoiceID, new_invoice);

    if(curUser.total() > 750 && !curUser.coupon) {
        console.log ("|*|Service exceeded $750.00, take a complimentary coupon!|*|");
        curUser.coupon = 1;
    }

}

function saveData() {
    let outClients = "";//blank strings for file output
    let outTrans = "";//blank strings for file output

    //sorting the client ID's into a new array
    let sortClients = Array.from(clients.values());
    sortClients.sort((a, b) => {return b.id - a.id});

    //loops over clients. they've already been sorted.
    for(let client of sortClients) {
       outClients += `${client.id},${client.firstName},${client.lastName},${client.coupon},${client.total()}\n`;

        let trans = Array.from(client.transactions.values());
        trans.sort((a,b) => {return b.week - a.week});

        for(let tran of trans) {
            outTrans += `${tran.id},${tran.userID},${tran.service},${tran.price},${tran.week}\n`;
        }

    }
    let clientFile = IO.writeFileSync('data/curlClient.csv', outClients, 'utf8');
    let transFile = IO.writeFileSync('data/curlTrans.csv', outTrans, 'utf8');
}

function displayData(){
    console.log(clients);
    for(let tran of trans) {
        console.log(tran);
    }
}
