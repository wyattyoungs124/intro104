//section 1
"use strict";
const REF = require('./reflib');
const IO = require('fs'); // For file I/O

//section 2
let runProgram = 1;
let failedLogins = 0;
let attemptsLimit = 3;
let curUser;
let userMap = new Map();
let transMap = new Map();
let accountMap = new Map();
let wallet = 1000;

class Transaction {
    constructor(id, accountID, amount, dateSeconds, date) {
        this.id = id;
        this.amount = amount;
        this.accountID = accountID;
        this.account = accountMap.get(accountID);
        this.dateSeconds = dateSeconds;
        if(date) {
            this.date = date;
        }
        else {
            date = new Date();
            date.setUTCSeconds(dateSeconds);
        }
    }

    toCSV() {
        return `${this.id},${this.accountID},${this.amount},${this.dateSeconds}`;
    }
}

class Account {
    constructor(id, ownerID, accountType) {
        this.id = id;
        this.ownerID = ownerID;
        this.owner = userMap.get(ownerID);
        this.accountType = accountType;
        this.transactions = [];
    }

    toCSV() {
        return `${this.id},${this.ownerID},${this.accountType}`
    }

    addTrans(trans) {
        this.transactions.push(trans);
    }

    balance() {
        let total = 0;
        for (let tran of this.transactions) {
            total += tran.amount;
        }
        return total;
    }

    display() {
        console.log(`Account ${this.id} ${this.accountType} - Balance ${this.balance()}`);
        for (let tran of this.transactions) {
            console.log(tran);
        }
    }

    row() {
        return `ID: ${this.id}- ${this.accountType}: ${this.balance()} - ${this.transactions.length} Transactions`;
    }
}

class User {
    constructor(id, firstName, lastName, pinNum) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.pinNum = pinNum;
        this.accounts = new Map();
    }

    toCSV() {
        return `${this.id},${this.firstName},${this.lastName},${this.pinNum}`;
    }

    createAccount(name) {
        name = name.toLowerCase();
        if(this.accounts.has(name)) {
            console.log("User already has that account!");
            return false;
        }
        let next_id = nextID(accountMap);
        let new_account = new Account(next_id, this.id, name);
        this.accounts.set(name, new_account);
        accountMap.set(next_id, new_account);
        return true;
    }

    display() {
        for (let acc of Array.from(this.accounts.values())) {
            console.log(acc.display());
        }
    }

    findAccount(name) {
        name = name.toLowerCase();
        return this.accounts.get(name);
    }

    withdraw(accountType, amount) {
        let acc = this.findAccount(accountType);
        if(!acc) {
            console.log("Not an account!");
            return false;
        }
        if(acc.balance() < amount) {
            console.log("Not enough money!");
        }
        let trans_id = nextID(transMap);
        let date = new Date();
        let trans = new Transaction(trans_id, this.id, amount * -1, Number(date), date);
        transMap.set(trans_id, trans);
        acc.addTrans(trans);
        return amount * -1;
    }

    deposit(accountType, amount) {
        let acc = this.findAccount(accountType);
        if (!acc) {
            console.log("Not an account!");
            return;
        }
        let trans_id = nextID(transMap);
        let date = new Date();
        let trans = new Transaction(trans_id, this.id, amount, Number(date), date);
        transMap.set(trans_id, trans);
        acc.addTrans(trans);
        return amount;
    }

    login(pin) {
        return this.pinNum === pin;
    }
}



//section 3
function main(){
    while(runProgram){
        try {
            loadData();
        }
        catch(err) {
            //console.log(err);
        }

        startATM();
    }
}

//section 4
main();

// Function to get the newest ID of whatever!
function nextID(inputmap) {
    let keys = Array.from(inputmap.keys());
    if(!keys) {
        return 1;
    }
    return Math.max(...keys) + 1;
}


function startMenu () { //Main Menu
    console.log("( A.T.M )++++ MAIN -- MENU ++++( A.T.M )");
    console.log("<<<(1)>>>>>( MAKE A WITHDRAWAL )<<<<<<(1)>>>");
    console.log("<<<(2)>>>>>( MAKE A DEPOSIT)<<<<<(2)>>>");
    console.log("<<<(3)>>>>>( CREATE NEW ACCOUNT)<<<<<(3)>>>");
    console.log("<<<(4)>>>>>( VIEW -- ALL -- TRANSACTIONS )<(5)>>>");
    console.log("<<<(5)>>>>>( EXIT -- ATM )<<<<<<<>>><(6)>>>");
    console.log("_________________________________________________");

    switch(REF.inputPosNumber("<<<<>>>>>>>( CHOICE -- SELECTION )<<<<<<>>>:  ")){
        case 1:
            doWithdrawal();
            break;
        case 2:
            doDeposit();
            break;
        case 3:
            createAccount();
            break;
        case 4:
            viewData();
            break;
        case 5:
            curUser = 0;
            console.log("__________________GOODBYE!____________________");
            break;
        default:
            console.log("___ERROR!: INVALID CHOICE, PLEASE TRY AGAIN___");
            break;
    }
}

//Listed below are all of the menu functions

function doWithdrawal() {
    let name = REF.inputString("Name the Account: ");
    let amount = REF.inputPosNumber("How much to withdraw?");
    let results = curUser.withdraw(name, amount);
    if(results) {
        wallet += results;
        console.log(`You've withdrawn ${amount}!`);
        saveData();
    }
}

function doDeposit() {
    let name = REF.inputString("Name the Account: ");
    let amount = REF.inputPosNumber("How much to deposit?");
    if(amount > wallet) {
        console.log("not enough money in your wallet!");
    }
    let results = curUser.deposit(name, amount);
    if(results) {
        wallet -= results;
        console.log(`You've deposited ${amount}!`);
        saveData();
    }
}

function createAccount() {
    let name = REF.inputString("Name the Account: ");
    if(curUser.createAccount(name)) {
        saveData();
        console.log("Account created!");
    }

}

function viewData() {
    console.log(`Account Data: ${curUser.firstname} ${curUser.lastName}`);
    console.log(curUser.display());
}

function doLogin() {
    if (failedLogins >= attemptsLimit) {
        runProgram = 0;
        console.log("Too many attempts terminal shutting down. ");
        return;
    }
    let id = REF.inputNumber("Enter your ID:  ");
    if (!userMap.has(id)) {
        console.log("User not found!");
        failedLogins++;
        return doLogin();

    }
    let user = userMap.get(id);

    let pin = REF.inputNumber("Enter your pin:  ");
    if (user.login(pin)) {
        return user;
    }
    else {
        console.log("Bad Pin!");
        failedLogins++;
        return doLogin();
    }
}

function startATM(){
    if(!curUser) {
        switch(REF.inputNumber("Enter 1 to Login, 0 to Create User, 2 to quit")) {
            case 0:
                curUser = createUser();
                break;
            case 1:
                curUser = doLogin();
                break;
            case 2:
                runProgram = 0;
                console.log("__________________GOODBYE!____________________");
                break;
            default:
                console.log("ERROR: NOt an option. Try again!");
                break;

        }
    }
    startMenu();
}

function createUser() {
    let next_id = nextID(userMap);
    let firstName = REF.inputString("Enter First Name:  ");
    let lastName = REF.inputString("Enter Last Name:  ");
    let goodpin;
    let pin;
    while(!goodpin) {
        pin = REF.inputPosNumber("Enter Your Pin:  ");
        if(!pin.toString().length === 4) {
            console.log("PIN must be a 4-digit number!");
        }
        else {
            goodpin = true;
        }
    }
    let user = new User(next_id, firstName, lastName, pin);
    userMap.set(next_id, user);
    console.log(`Welcome to the bank! Your User ID is: ${next_id}`);
    saveData();
    return user;
}

function saveData() {
    let outAccount = "";
    let outTrans = "";
    let outUser = "";

    let fileAccount = 'final/finalAccount.csv';
    let fileTrans = 'final/finalTrans.csv';
    let fileUser = 'final/finalUser.csv';

    let all_users = Array.from(userMap.values());
    let all_accounts = Array.from(accountMap.values());
    let all_transactions = Array.from(transMap.values());

    for (let group of [all_users, all_accounts, all_transactions]) {
        group.sort((a, b) => {return a.id - b.id});
    }
    let outputs = [[outUser, all_users, fileUser], [outAccount, all_accounts, fileAccount],[outTrans, all_transactions, fileTrans]];

    for(let out of outputs) {
        for(let row of out[1]) {
            out[0] += row.toCSV() + '\n';
        }
        IO.writeFileSync(out[2], out[0], 'utf8');
    }
}

function loadData() {
    let fileAccount = 'final/finalAccount.csv';
    let fileTrans = 'final/finalTrans.csv';
    let fileUser = 'final/finalUser.csv';

    let userFile = IO.readFileSync(fileUser, `utf8`);

    for (let line of userFile.toString().split(/\r?\n/)) {
        if(line) {
            let data = line.split(',');
            let user = new User(Number(data[0]),data[1],data[2],Number(data[3]));
            userMap.set(user.id, user);
        }
    }

    let accountFile = IO.readFileSync(fileAccount, `utf8`);

    for (let line of accountFile.toString().split(/\r?\n/)) {
        if(line) {
            let data = line.split(',');
            let account = new Account(Number(data[0]),Number(data[1]),data[2]);
            accountMap.set(account.id, account);
        }
    }

    let transFile = IO.readFileSync(fileTrans, `utf8`);

    for (let line of transFile.toString().split(/\r?\n/)) {
        if(line) {
            let data = line.split(',');
            let trans = new Transaction(Number(data[0]),Number(data[1]),Number(data[2]), Number(data[3]));
            transMap.set(trans.id, trans);
        }
    }
}