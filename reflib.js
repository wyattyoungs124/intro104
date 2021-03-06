//section 1
"use strict";
const PROMPT = require('readline-sync');

function inputString(display, recursive=true){
    let input = PROMPT.question(display);
    if(!input) {
        if(recursive) {
            console.log("Please enter something!");
            return inputString(display, recursive);
        }
        else {
            throw "Exception: Must enter text!";
        }
    }
    return input;
}

exports.inputString = inputString;

function inputNumber(display, recursive = true){
    let input = Number(inputString(display, recursive));
    if(isNaN(input)) {
        if(recursive) {
            console.log("Please enter a number!");
            return inputNumber(display, recursive);
        }
        else {
            throw "Exception: Must enter a number!";
        }
    }
    return input;
}

exports.inputNumber = inputNumber;

function inputPosNumber(display, recursive = true){
    let input = inputNumber(display, recursive);
    if(input < 0) {
        if(recursive) {
            console.log("Please enter a positive number!");
            return inputPosNumber(display, recursive);
        }
        else {
            throw "Exception: Must enter a positive number!";
        }
    }
    return input;
}

exports.inputPosNumber = inputPosNumber;


// Gets a Date. Accepts anything that a Date() object constructor does.
function inputDate(display, recursive = true) {
    let input = new Date(inputString(display, persistent));
    if(isNaN(input.getTime())) {
        if(recursive) {
            console.log("ERROR: Response must be a date! Please try again!");
            input = inputDate(display, recursive);
        }
        else {
            throw "ERROR: Response must be a date!";
        }
    }
    return input;
}

exports.inputDate = inputDate;