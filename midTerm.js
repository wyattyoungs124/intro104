/*
Write a program that simulates an  automatic teller   machine   ( ATM ) .
Assume an initial balance of $1,000.00 in both a checking and savings  account.
A user may withdraw, deposit, transfer funds,
or inquire as  many times as she desires.
The program will only end when the user chooses to quit,
otherwise the program should loop and prompt the  users for actions.
For security, include an authentication routine that will prompt the user
to enter a card holder name, number, and pin. The user is only allowed
three attempts to enter the correct pin which should authenticate to
the correct card number (you should have card number/pin combos  already in your
program that the user tests against. After the third  attempt the program should
terminate
 */

//section 1
"use strict";
const REF = require('./reflib');


//section 2
let myWallet = 500;

let accName;
let curUser;
let users = [];
let userMap = new Map();
let keepRunning = 1;
let failedLogins = 0;
let attemptsLimit = 3;

const CHECKING_BALANCE = 1000;
const SAVINGS_BALANCE = 1000;
    
const START_USERS = [
    [0, "Andrew", "Bastien", 3186],
    [1, "Nick", "Weiss", 9900],
    [2, "Wyatt", "Youngs", 8000]
];

class User{
    constructor(id, firstName, lastName, checkings, savings, pin) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.checkings = checkings;
        this.savings = savings;
        this.pin = pin;
    }

    depositSavings(amount){
        this.savings += amount;
    }

    depositChecking(amount) {
        this.checkings += amount;
    }

    withdrawCheckings(amount) {
        if(amount > this.checkings){
            throw "Error: Too much withdrawn!";
        }
        this.checkings -= amount;
        return this.checkings;
    }

    withdrawSavings(amount) {
        if(amount > this.savings){
            throw "Error: Too much withdrawn!";
        }
        this.savings -= amount;
        return this.savings;
    }

    login(firstName, lastName, pin) {
        return firstName === this.firstName && lastName === this.lastName && pin === this.pin;
    }

    display() {
        let outtext = "";
        outtext += `Account Name: ${curUser.firstName} ${curUser.lastName}\n`;
        outtext += `Checkings: $${curUser.checkings} Savings: $${curUser.savings}\n`;
        outtext += `Your Wallet: $${myWallet}`;
        return outtext;
    }

    get name() {
        return `${this.firstName} ${this.lastName}`;
    }

}

//section 3
function main() {
    console.clear();
    loadUsers();
    login();
    while(keepRunning) {
        runMenu();
    }
}

main();

//section 4


function loadUsers() {
    for (let suser of START_USERS) {
        let newUser = new User(suser[0], suser[1], suser[2], CHECKING_BALANCE, SAVINGS_BALANCE, suser[3]);
        users.push(newUser);
        userMap.set(newUser.id, newUser);
    }
}

function login(){
    if (failedLogins>=attemptsLimit){
        keepRunning = 0;
        console.log("Too many attempts terminal shutting down. ");
        return;
    }
    let id = REF.inputNumber("Enter your ID:  ");
    if (!userMap.has(id)){
        console.log("Account not found!");
        failedLogins++;
        return login();

    }
    let account = userMap.get(id);
    let first   = REF.inputString("Enter First Name:  ");
    let last    = REF.inputString("Enter Last Name:  ");
    let pin     = REF.inputNumber("Enter your pin:  ");
    if(account.login(first, last, pin)) {
        curUser = account;
    }
    else {
        console.log("Account not found!");
        failedLogins++;
        return login();
    }
}

function doWithdraw() {
    let CashAmount = REF.inputPosNumber("Enter amount to withdraw:  ");
    let accName;
    try {
        switch(REF.inputNumber("1 for Checkings, 2 for Savings: ")) {
            case 1:
                curUser.withdrawCheckings(CashAmount);
                accName = "Checkings";
                break;
            case 2:
                curUser.withdrawSavings(CashAmount);
                accName = "Savings";
                break;
            default:
                console.log("Invalid choice! Please try again.");
                return;
        }
    }
    catch(err) {
        console.log(err);
    }
    myWallet += CashAmount;
    console.log(`You have withdrawn $${CashAmount} from your ${accName} account.`);
}

function doTrans() {
    let id = REF.inputNumber("Enter destination ID:  ");
    if (!userMap.has(id)){
        console.log("Account not found!");
        return;
    }
    let account = userMap.get(id);
    let CashAmount = REF.inputPosNumber("Enter amount you're transferring:  ");
    try {
        switch(REF.inputNumber("1 for Checkings, 2 for Savings (Source): ")) {
            case 1:
                curUser.withdrawCheckings(CashAmount);
                break;
            case 2:
                curUser.withdrawSavings(CashAmount);
                break;
            default:
                console.log("Invalid choice! Please try again.");
                return;
        }
    }
    catch(err) {
        console.log(err);
        return;
    }

    try {
        let incompleteTrans = 1; // While loop prevents returning here from leaving funds withdrawn but not deposited.
        while(incompleteTrans) {
            switch (REF.inputNumber("1 for Checkings, 2 for Savings (Destination): ")) {
                case 1:
                    account.depositChecking(CashAmount);
                    incompleteTrans = 0;
                    break;
                case 2:
                    account.depositSavings(CashAmount);
                    incompleteTrans = 0;
                    break;
                default:
                    console.log("Invalid choice! Please try again.");
                    break;
            }
        }
    }
    catch(err) {
        console.log(err);
        return;
    }

    console.log(`You have transferred $${CashAmount} to ${account.name}`);
}

function doDeposit() {
    let CashAmount = REF.inputPosNumber("Enter amount you're depositing:  ");
    if(CashAmount > myWallet) {
        console.log("Not enough money to deposit!");
        return;
    }

    try {
        switch(REF.inputNumber("1 for Checkings, 2 for Savings: ")) {
            case 1:
                curUser.depositChecking(CashAmount);
                accName = 'Checkings';
                break;
            case 2:
                curUser.depositSavings(CashAmount);
                accName = 'Savings';
                break;
            default:
                console.log("Invalid choice! Please try again.");
                return;
        }
    }
    catch(err) {
        console.log(err);
        return;
    }
    myWallet -= CashAmount;
    console.log(`You have deposited ${CashAmount} from your ${accName}. `);
}

function doInquire() {
    console.log(curUser.display());
}

function runMenu(){
    console.log("1. Withdraw");
    console.log("2. Deposit");
    console.log("3. Transfer Funds");
    console.log("4. Inquire");
    console.log("5. Logout and Quit");


    switch(REF.inputNumber("Choice Number:  ")) {
        case 1:
            doWithdraw();
            break;
        case 2:
            doDeposit();
            break;
        case 3:
            doTrans();
            break;
        case 4:
            doInquire();
            break;
        case 5:
            keepRunning = 0;
            break;
        default:
            console.log("Invalid choice!");
            break;
    }
}