/*
The Curl Up and Dye Beauty Salon maintains a master file that contains a record for each of its clients. Fields in the master file include the client's ID number, first name, last name, and total amount spent this year. Every week, a transaction file is produced. It contains a customer's ID number, the service received (for example, Manicure), and the price paid. Each file is sorted in ID number order. Write a program that matches the master and transaction file records and updates the total paid for each client by adding the current week's price paid to the cumulative total. Not all clients purchase services each week. The output is the updated master file and an error report that lists any transaction records for which no master record exists. Output a coupon for a free haircut each time a client exceeds $750 in services. The coupon, which contains the client's name and an appropriate congratulatory message, is output during the execution of the update program when a client total surpasses $750.
 */

//section 1
"use strict";
const REF = require('./reflib');
const IO = require('fs'); // For file I/O

//section 2
let runCurlUp = 1;

let clients = new Map();
let allTrans = [];

class Person {
    constructor(id,first,last) {
        this.id = id;
        this.first = first;
        this.last = last;
        this.transactions = new Map();
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
    constructor(id, service, price, week) {
        this.id = id;
        this.service = service;
        this.price = price;
        this.week = week;
    }
}


//section 3
function main(){
    while(runCurlUp) {
        runProgram();
    }
}
//section 4
main();

function runProgram() {
    console.log("1. Add New Client");
    console.log("2. Show Clients");
    console.log("3. Record Service");
    console.log("4. Save Data");
    console.log("5. Load Data");
    console.log("6. Quit Program");

    switch(REF.inputNumber("Choice: ")) {
        case 1:
            addClient();
            break;
        case 2:
            showClients();
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
            runCurlUp = 0;
            console.log("Bye!");
            break;
        default:
            console.log("Invalid choice! Try again.");
            break;
    }
}

function addClient() {
    let id = REF.inputNumber("Enter New ID: ");
    if(clients.has(id)) {
        console.log("ERROR: ID already in use!");
        return;
    }
    let first = REF.inputString("First Name: ");
    let last = REF.inputString("Last Name: ");
    clients.set(id, new Person(id, first, last));
}

function showClients() {
    console.log(clients);
}

function loadData() {
    clients = new Map();
    allTrans = [];
    let dataFile = IO.readFileSync(`data/curlClients.csv`, 'utf8');
    let lines = dataFile.toString().split(/\r?\n/);
    for (let line of lines) {
        if(line.toString().length) {
            let data = line.toString().split(/,/);
            clients.set(Number(data[0]), new Person(Number(data[0]),data[1],data[2]));
        }
    }

    let tranFile = IO.readFileSync('data/curlTrans.csv', 'utf8');
    for (let line of tranFile.toString().split(/\r?\n/)) {
        if(!line) {
            continue;
        }
        let data = line.toString().split(/,/);
        let trans = new Invoice(Number(data[0]),data[1],Number(data[2]),Number(data[3]));
        if(!clients.has(trans.id)) {
            console.log(`ERROR: No Client ${trans.id}`);
            continue;
        }
        allTrans.push(trans);
        clients.get(trans.id).transactions.set(trans.week,trans);
    }
}

function saveData() {
    // Create blank strings for eventual text file output.
    let outstring = "";
    let transtring = "";

    // Sorting the client IDs into a new array.
    let ids = Array.from(clients.keys());
    ids.sort((a, b) => {return b - a});

    // Loop over clients by IDs in order.
    for (let id of ids) {
        let client = clients.get(id);
        if (!client) {
            continue; // If no client, skip this client.
        }

        // Add line to outfile for this client's data. Using CSV (comma-separated value) format.
        outstring += `${id},${client.first},${client.last},${client.total()}\n`;

        // Now process client's transactions.
        // First, sorting the transactions by week order.
        let trans = Array.from(client.transactions.values());
        trans.sort((a,b) => {return b.week - a.week});

        // Loop over transactions in given order.
        for (let tran of trans) {

            // Same as before, adding to the transtring CSV output.
            transtring += `${tran.id},${tran.service},${tran.price},${tran.week}\n`;
        }

    }

    // By this point we are out of the for loop. All data has been converted to a text file.

    // IO.writeFileSync is 'write to disk.' the Sync means Synchronous, or 'right now.'
    // We specify this because NodeJS also has asynchronous mode, where it may wait on the
    // operating system to do it whenever it feels like. We want it done NOW.
    // 'utf8' is the file encoding. Basic, standard text file.
    let outFile = IO.writeFileSync('data/curlClients.csv', outstring, 'utf8');
    let tranFile = IO.writeFileSync('data/curlTrans.csv', transtring, 'utf8');

}

function addService() {
    let id = REF.inputNumber("Client ID: ");
    if(!clients.has(id)) {
        console.log("No client found!");
        return;
    }
    let client = clients.get(id);
    let prevTotal = client.total();
    let week = REF.inputNumber("What week number: ");
    if(client.transactions.has(week)) {
        console.log("Client already serviced that week!");
        return;
    }
    let service = REF.inputString("What Service: ");
    let price = REF.inputNumber("What price: ");
    let trans = new Invoice(id,service,price,week);
    allTrans.push(trans);
    client.transactions.set(week,trans);
    if(prevTotal < 750 && client.total() >= 750) {
        console.log("Congratulations! Have a free coupon.");
    }
}