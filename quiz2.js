
/**
 *   @author Bates, Howard (hbates@northmen.org)
 *   @version 0.0.1
 *   @summary Code demonstration: Collections (Arrays) :: created: 6.13.2017
 *   @todo Nothing
 */
//
"use strict";   //enabling strict mode
const PROMPT = require('readline-sync'); //library call

let continueResponse; //declaring a global variable, "continueResponse"
let numStudents; //declaring global variable, "numStudents"
let students = [], rewardStudents = []; // declaring global arrays "students" and "rewardStudents"

/**
 * @method
 * @desc The dispatch method for our program
 * @returns {null}
 */
function main() {//defining main function
    if (continueResponse !== 0 && continueResponse !== 1) { //creating an "if" statement that says if "continueResponse" is not equal to 0 or 1, call function "setContinueResponse"
        setContinueResponse();//call function "setContinueResponse"
    }
    setNumStudents();   //call function "setNumStudents"
    populateStudents(); //call function "populateStudents"
    while (continueResponse === 1) { //creating a while loop giving it the parameters, while continueResponse is equal to 1 run the three functions below.
        determineRewardStudent();   //call function "determineRewardStudent"
        displayRewardStudent();     //call function "displayRewardStudent"
        setContinueResponse();      //call function "setContinueResponse"
    }
}

main(); //call to main

/**
 * @method
 * @desc continueResponse mutator
 * @returns {null}
 */
function setContinueResponse() {    //defining function setContinueResponse
    if (continueResponse === 1 || continueResponse === 0) { //creating an if statement with the parameters, if continueResponse is equal to 1 or 0 run whats defined
        continueResponse = Number(PROMPT.question(`\nDo you want to continue? [0=no, 1=yes]: `));   //prompt the user to enter a number 0 or 1 and setting answer to "continueResponse"
        while (continueResponse !== 0 && continueResponse !== 1) {      //creating a while loop with the parameters if continueResponse is not equal to 1 or 0 run whats defined
            console.log(`${continueResponse} is an incorrect value. Please try again.`);    //logs the value of "continueResponse" and logs "is an incorrect value. Please try again."
            continueResponse = Number(PROMPT.question(`\nDo you want to continue? [0=no, 1=yes]: `));   //prompt the user to enter a number 0 or 1 and setting answer to "continueResponse"
        }
    } else {    //creating an else argument for the if statement
        continueResponse = 1;   //setting continueResponse to equal 1
    }
}

/**
 * @method
 * @desc numStudents mutator
 * @returns {null}
 */
function setNumStudents() {     //defining function "setNumStudents"
    const MIN_STUDENTS = 1, MAX_STUDENTS = 34;  //declaring a constant "MIN_STUDENTS " with a value of 1 and "MAX_STUDENTS" with a value of 34
    while (! numStudents || numStudents < MIN_STUDENTS || numStudents > MAX_STUDENTS) { //creating a while loop with the parameters, if there is no "numStudents" or if "numStudents
        numStudents = Number(PROMPT.question(`Please enter number of students in classroom: `)); //prompts "please enter number of students in the classroom:  " to user and then puts the value into "numStudents"
        if (isNaN(parseInt(numStudents)) || numStudents < MIN_STUDENTS || numStudents > MAX_STUDENTS) { //creating a if statement with the parameters, if 'numStudents' is not a number or if "numStudents" is less than 'MIN_STUDENTS' or if "numStudents" is greater than "MAX_STUDENTS", pass to the definition of the if statement.
            console.log(`${numStudents} is an incorrect value. Please try again.`); // logs the value of "numStudents" and "is an incorrect value. please try again."
        }
    }
}

/**
 * @method
 * @desc students MD array mutator
 * @returns {null}
 */
function populateStudents() {   //defining function "populateStudents"
    const MIN_GRADE = 0, MAX_GRADE = 8; //creating two local constants, "MIN_GRADE = 0" and "MAX_GRADE = 8" for the function "populateStudents"
    for (let i = 0; i < numStudents; i++) { //creating a for loop with the parameters setting "i" to 0 saying if "i" is less than "numStudents" add one to "i".
        students[i] = [];   //making a two dimensional array.
        console.log(`\nStudent ${i + 1}:`); //logs a new line and "Student" and the value of "i" plus one
        while (! students[i][0] || !/^[a-zA-Z -]{1,30}$/.test(students[i][0])) {  //while students[i][0] is false or if the value of "students" is not alphabetical characters or in between 1-30 characters
            students[i][0] = PROMPT.question(`Please enter last name: `); //prompts user to enter last name and value gets stored into "students[i][0]".
            if (! /^[a-zA-Z -]{1,30}$/.test(students[i][0])) {  //defining an if statement with the parameters if the value of students is not alphabetical or in bretween 1 -30 characters.
                console.log(`${students[i][0]} is invalid. Please try again.`); // logs the value of "students[i][0]" and "is invalid. Please try again."
            }
        }
        while (! students[i][1] || !/^[a-zA-Z -]{1,30}$/.test(students[i][1])) {
            students[i][1] = PROMPT.question(`Please enter first name: `);
            if (! /^[a-zA-Z -]{1,30}$/.test(students[i][1])) {
                console.log(`${students[i][1]} is invalid. Please try again.`);
            }
        }
        while (! students[i][2] || !/^\d{2}\/\d{2}\/\d{4}$/.test(students[i][2])) {
            students[i][2] = PROMPT.question(`Please enter date of birth (xx/xx/xxxx): `);
            if (! /^\d{2}\/\d{2}\/\d{4}$/.test(students[i][2])) {
                console.log(`${students[i][2]} is invalid. Please try again.`);
            }
        }
        while (! students[i][3] || students[i][3] < MIN_GRADE || students[i][3] > MAX_GRADE) {
            students[i][3] = PROMPT.question(`Please enter grade level (0-8): `);
            if (students[i][3] < MIN_GRADE || students[i][3] > MAX_GRADE) {
                console.log(`${students[i][3]} is invalid. Please try again.`);
            }
        }
        while (! students[i][4] || !/^[mMfF]$/.test(students[i][4])) {
            students[i][4] = PROMPT.question(`Please enter gender (m or f): `).toLowerCase();   //prompts user to enter their gender and to enter a m or f and then sets value to lower case and then passes it into "students[i][4]
            if (! /^[mMfF]$/.test(students[i][4])) {    //creating an if statement with the parameters to enter a mM or fF and to test the value in "students [i][4]
                console.log(`${students[i][4]} is invalid. Please try again.`);
            }
        }
    }
}

/**
 * @method
 * @desc rewardedStudents SD array mutator
 * @returns {null}
 */
function determineRewardStudent() { //defining function "determineRewardStudent"
    let rewarded = false;   //creating a local variable "rewarded" with the value false
    while (! rewarded) {    //creating a while loop with parameters saying if reward is not false run loop.
        rewarded = true;    //defining the local variable "rewarded" with true.
        let randomStudent = Math.floor((Math.random() * students.length));  // defining a local variable "randomStudent" setting t
        if (rewardStudents.length > 0 && rewardStudents.length < students.length) { //defining a if statement with the parameters if the length of "rewardStudents" is greater than 0 and is less than the length of students.
            for (let student of rewardStudents) { //creating a for loop with the parameters looping over "rewardStudents" and setting each element to student.
                if (student === randomStudent) {    //creating an if statement with the parameters if student is equal to "randomStudent"
                    rewarded = false;   //defining rewarded as false
                    break;//breaking out of the for loop
                }
            }
            if (rewarded) { //defining an if statement with the parmeter of the value of "rewarded"
                rewardStudents.push(randomStudent); // pushes value of "randomStudent" into the rewardStudents
                break;//breaks out of if statement
            }
        } else {//defining the else statement for if
            rewardStudents = [];    //creating local array of "rewardStudents"
            rewardStudents.push(randomStudent); //pushing the value of "randomStudent" into "rewardStudents"
         }
    }
    console.log(rewardStudents);    //logs the value of "rewardStudent"
}

/**
 * @method
 * @desc Utility method for outputting result
 * @returns {null}
 */
function displayRewardStudent() { //defining function "displayRewardStudent"
    console.log(`You get to reward ${students[rewardStudents[rewardStudents.length - 1]][0]} today!`); //logs "you get to reward" and then the value of "students", "rewardStudents", the length of "rewardStudents", prints out last name or rewarded students  , and "today! "
}

/*
 The "Hurr Durr, Make 'em Smarter Everyday" private school has again contracted you to write software that stores the following
 information about each student: Last & first name, DoB, grade level, & gender. The software should also allow teacher to
 randomly select one (1) student per day to give a special reward. Previously selected students cannot be chosen again
 until entire class has been selected at least once.
 Topics:  Collections (single & multi-dimensional arrays), for..of loops, regular expressions (regex)
 */