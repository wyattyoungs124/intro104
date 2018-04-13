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
let allTrans = [];

//Classes
class User {
    constructor(id,first,last){
        this.id = id;
        this.firstName = first;
        this.lastName = last;
        this.transactions = new Map();
    }
    total(){
        let output = 0;
        for(let tran of this.transactions.values()){
            output += tran.price;
        }
        return output;
    }
}

class Invoice {
    constructor(id,service, price, week){
        this.id = id;
        this.service = service;
        this.price = price;
        this.week = week;
    }
}

//section 3
function main (){
    while(runProgram){
    startCurlUp();
    }
}

//section 4
main();

function startCurlUp() {
    console.log("*****************MAIN*MENU****************");
    console.log("]][[-*1*-]][[Add[]New[]Client]][[-*1*-]][[");
    console.log("]][[-*2*-]][[Client[]Archive]]][[-*2*-]][[");
    console.log("]][[-*3*-]][[Add[]A[]Service]]][[-*3*-]][[");
    console.log("]][[-*4*-]][Save[]All[]Data]]][[[-*4*-]][[");
    console.log("]][[-*5*-]][Service[]Archive]]][[-*5*-]][[");
    console.log("]][[-*6*-]][[[Exit[]Program]]]][[-*6*-]][[");
    console.log("******************************************");

    switch(REF.inputPosNumber("]][]]][[]][[Choice[]Selection]][[]][[]=>  ")){
        case 1:
            newClient();
            break;
        case 2:
            loadClients();
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

function newClient(){
    let id = REF.inputNumber("************Enter**new**id**number******=>  ");
    if(clients.has(id)){
        console.log("ERROR: ID already in use!");
        return;
    }
    let firstName = REF.inputString("************Enter**First**Name**********=>  ");
    let lastName = REF.inputString ("************Enter**Last**Name***********=>  ");
    clients.set(id, new Person(id,firstName,lastName));
}

function loadClients(){
    console.log(clients);
}
function addService(){

}