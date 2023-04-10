"use strict";
setURL('https://tijana-couturier.developerakademie.net/smallest_backend_ever');

let usernames = [];
let usermails = [];

/**
 * 
 * function to download needed jsons from server
 * 
 * @param {none}
 */

async function initLogin() {
    await downloadFromServer();
    await loadFromBackend();
    await loadData();
}


/**
 * 
 * function to download needed arrays from localstorage
 * 
 * @param {none}
 */

async function loadData() {
    let usernamesAsText = await backend.getItem('usernames');
    let usermailsAsText = await backend.getItem('usermails');

    let usernamesAfterLocalStorage = JSON.parse(usernamesAsText);
    let usermailsAfterLocalStorage = JSON.parse(usermailsAsText);
}


/**
 * 
 * function to check if respectful user who's trying to log in has already logged in before, as if so, he would not have to create a new account
 * 
 * @param {none}
 */

function newLogin() {
    save();
    setTimeout(checkUserStatus(), 2000);
}


/**
 * 
 * function to check if user is new or had logged in before 
 * @param {none}
 */

async function checkUserStatus() {
    let currentUserName = document.getElementById('username').value;
    let currentUserMail = document.getElementById('usermail').value;
    let stringUserName = jsonFromServer['usernames'];
    let stringUserMail = jsonFromServer['usermails'];
    stringUserName.replace(/["\[\]"]+/g, "");
    stringUserMail.replace(/["\[\]"]+/g, "");

    if (stringUserName.includes(currentUserName) && stringUserMail.includes(currentUserMail)) {
        alert('It seem like you already have an account. We will log you in with that one!👍🏻')
        redirect();
    } else if (!(stringUserName.includes(currentUserName)) && !(stringUserMail.includes(currentUserMail))) {
        usernames.push(currentUserName);
        usermails.push(currentUserMail);
        await save();
        await loadData();
        saveToBackend();
        redirect();
    }
}


/**
 * 
 * function to redirect to addtask.html page
 * 
 * @param {none}
 */

function redirect() {
    return window.location.href = "https://tijana-couturier.developerakademie.net/Join/addTask.html?";
}


/**
 * 
 * function to save login informations (username && email) of new registered users to the usernames && usermails arrays
 * 
 * @param {none}
 */

async function save() {
    let usernamesAsText = JSON.stringify(usernames);
    let usermailsAsText = JSON.stringify(usermails);

    await backend.setItem('usernames', usernamesAsText);
    await backend.setItem('usermails', usermailsAsText);
}


/**
 * 
 * function to open the sign in menu
 * 
 * @param {none}
 */

function openSignInMenu() {
    document.getElementById('login-menu-div').style = 'display: none';
    document.getElementById('sign-in-menu-div').style = 'display: auto';
}


/**
 * 
 * function to close sign in menu again and reopen signup menu
 * 
 * @param {none}
 */

function closeSignInMenu() {
    document.getElementById('sign-in-menu-div').style = 'display: none';
    document.getElementById('login-menu-div').style = 'display: auto';
}


/**
 * 
 * function to check if name in input field is already included in usernames array
 * 
 * @param {none}
 */

function newSignIn() {
    let usernameOnSignIn = document.getElementById('usernameOnSignIn').value;
    let string = jsonFromServer['usernames'];
    string.replace(/["\[\]"]+/g, "");

    if (string.includes(usernameOnSignIn)) {
        redirect();
    } else {
        alert('Your Account was not found. Please contact support or try to create a new one.🙏')
    }
}