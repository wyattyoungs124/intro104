/*The Timely Talent Temporary Help Agency maintains an employee master file that contains
employee ID number,
last name,
first name,
address,
and hourly rate for each temporary worker.
The file has been sorted in employee ID number order.
a transaction file is created with a
job number,
address,
customer name,
employee ID,
Date, and hours worked for every job
The transaction file is also sorted in employee ID order.

a. Design the logic for a program that matches the current week's transaction file records to the master file and outputs one line for each transaction, indicating job number, employee ID number, hours worked, hourly rate, and gross pay. Assume that each temporary worker works at most one job per week. Output one line for each worker, even if the worker has completed no jobs during the current week.

b. Allow the program to output lines only for workers who have completed at least one job during the current week.

c. Ensure that any temporary worker can work any number of separate jobs during the week. Output one line for each job that week.

d. Ensure that it accumulates the worker's total pay for all jobs in a week and outputs one line per worker.
*/

//section 1
"use strict";
const REF = require('./reflib');
const IO = require('fs'); // For file I/O

//section 2
let runProgram = 1;
let transMap = new Map();
let empMap = new Map();

class Employee {
    constructor(id, firstName, lastName, address, hrRate) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.hrRate = hrRate;
        this.weeks = new Map();
        this.transactions = [];
    }

    addTrans(trans) {
        if(!this.weeks.has(trans.week)) {
            this.weeks.set(trans.week, [])
        }
        this.weeks.get(trans.week).push(trans);
        this.transactions.push(trans);
    }

    // Week: A number.
    totalWeek(week) {
        let total = 0;
        for(let tran of this.weeks.get(week)) {
            total += tran.hrWork;
        }
        return this.hrRate * total;
    }

    total() {
        let total = 0;
        for(let tran of this.transactions) {
            total += tran.hrWork;
        }
        return total * this.hrRate;
    }

}

class transClass{
    constructor(jobNum, empID, jobAddress, custFirst, custLast, hrWork, week){
        this.jobNum = jobNum;
        this.empID = empID;
        this.jobAddress = jobAddress;
        this.custFirst = custFirst;
        this.custLast = custLast;
        this.hrWork = hrWork;
        this.week = week;
    }
}

//section 3
function main(){
while(runProgram){
    startTTTHA();
    }
}

//section 4
main();

function startTTTHA(){ //Main Menu
    console.log("( T.T.T.H.A )++++ MAIN -- MENU ++++( T.T.T.H.A )");
    console.log("<<<(1)>>>>>( ADD -- A -- EMPLOYEE )<<<<<<<<(1)>>>");
    console.log("<<<(2)>>>>>( ADD -- A -- TRANSACTION )<<<<<(2)>>>");
    console.log("<<<(3)>>>>>( VIEW -- ALL -- TRANSACTIONS )<(3)>>>");
    console.log("<<<(4)>>>>>( SAVE -- ALL-- DATA )<<<<<<<<<<(4)>>>");
    console.log("<<<(5)>>>>>( LOAD -- ALL-- DATA )<<<<<<<<<<(5)>>>");
    console.log("<<<(6)>>>>>( EXIT -- T.T.T.H.A )<<<<<<<>>><(6)>>>");
    console.log("_________________________________________________");

    switch(REF.inputPosNumber("<<<<>>>>>>>( CHOICE -- SELECTION )<<<<<<>>>:  ")){
        case 1:
            addEmployee();
            break;
        case 2:
            addTrans();
            break;
        case 3:
            viewTrans();
            break;
        case 4:
            saveData();
            break;
        case 5:
            loadData();
            break;
        case 6:
            runProgram = 0;
            console.log("__________________GOODBYE!____________________");
            break;
        default:
            console.log("___ERROR!: INVALID CHOICE, PLEASE TRY AGAIN___");
            break;
    }
}

//Listed below are all of the menu functions

function addEmployee () {
    let id = REF.inputNumber("************Enter**new**id**number******=>  ");
    if(empMap.has(id)) {
        console.log("ERROR: ID already in use!");
        return;
    }
    let firstName = REF.inputString("************Enter--First--Name**********=>  ");
    let lastName = REF.inputString ("************Enter--Last--Name***********=>  ");
    let address = REF.inputString("Enter Address:  ");
    let rate =  REF.inputPosNumber("Enter Hourly Rate:  ");

    empMap.set(id, new Employee(id, firstName, lastName, address, rate));
}

function addTrans() {
    let curUser = empMap.get(REF.inputPosNumber("************Enter--Employee--ID--number**=>  "));
    if (!curUser) {
        console.log("ERROR: Employee ID not found! ");
        return;
    }
    let goodid = false, invoiceID;

    while (!goodid) {
        invoiceID = REF.inputPosNumber("************Enter--Job--ID--number**=>  ");
        if (!transMap.has(invoiceID)) {
            goodid = true;
        }
        else {
            console.log("Job ID number is already used. Please try again.");
        }

        let jobAddress = REF.inputString("Enter Address:  ");
        let custFirst = REF.inputString("Enter Cust First:  ");
        let custLast = REF.inputString("Enter Cust Last:  ");
        let hours = REF.inputPosNumber("Enter Number of Hours:  ");
        let week = REF.inputPosNumber("Week: ");
        let new_invoice = new transClass(invoiceID, curUser.id, jobAddress, custFirst, custLast, hours, week);
        curUser.addTrans(new_invoice);
        transMap.set(invoiceID, new_invoice);
    }
}


function viewTrans(){
    console.log(empMap);
    for(let tran of transMap) {
        console.log(tran);
    }
}

function saveData() {
    let outEmployee = "";//blank strings for file output
    let outTrans = "";//blank strings for file output

    //sorting the client ID's into a new array
    let sortEmployees = Array.from(empMap.values());
    sortEmployees.sort((a, b) => {return b.id - a.id});

    //loops over clients. they've already been sorted.
    for(let employee of sortEmployees) {
        outEmployee += `${employee.id},${employee.firstName},${employee.lastName},${employee.address},${employee.hrRate},${employee.total()}\n`;

        let trans = employee.transactions;
        trans.sort((a,b) => {return b.week - a.week});

        for(let tran of trans) {
            outTrans += `${tran.jobNum},${tran.empID},${tran.jobAddress},${tran.custFirst},${tran.custLast},${tran.hrWork},${tran.week}\n`;
        }

    }
    let clientFile = IO.writeFileSync('data/talentClient.csv', outEmployee, 'utf8');
    let transFile = IO.writeFileSync('data/talentTrans.csv', outTrans, 'utf8');
}

function loadData() {
    // Clear out global variables. Just in case.
    empMap = new Map();
    transMap = new Map();

    // Create file handle to our save file.
    let dataFile = IO.readFileSync(`data/talentClient.csv`, 'utf8');

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
            empMap.set(Number(data[0]), new Employee(Number(data[0]),data[1],data[2],data[3],Number(data[4])));
        }
    }

    // Now we'll load transactions.
    dataFile = IO.readFileSync(`data/talentTrans.csv`,  'utf8');
    lines = dataFile.toString().split(/\r?\n/);

    for(let line of lines) {
        if(line) {
            let data = line.toString().split(/,/);
            let emp = empMap.get(Number(data[1]));
            if(emp) {
                let new_trans = new transClass(Number(data[0]),Number(data[1]),data[2],Number(data[3]),Number(data[4]));
                emp.addTrans(new_trans);
            }
            else {
                console.log(`Could not load Transaction ${data[0]}. Employee not found.`);
            }
        }
    }

}