"use strict"
setURL('https://tijana-couturier.developerakademie.net/smallest_backend_ever');

let userSelected = false;
let selectedUsers = [];
let allTasks = [];
let u;
let s;

let users = [{
        'img': 'Anja.jpg',
        'name': 'Anja Hovhannisyan',
        'email': 'anja.hovhannisyan'
    },
    {
        'img': 'Tijana.png',
        'name': 'Tijana Couturier',
        'email': 'tijana.couturier',
    },
    {
        'img': 'Max.png',
        'name': 'Maximilian Tauber',
        'email': 'maximilian.tauber',
    },
];


async function init() {
    addAvartar();
    await includeHTML();
    await downloadFromServer2();
    await loadFromBackend2();
    menuInit();
}


async function downloadFromServer2() {
    let result = await loadJSONFromServer2();
    jsonFromServer = JSON.parse(result);
    console.log('Loaded2', result);
    console.log('Loaded', jsonFromServer);
}


async function loadJSONFromServer2() {
    let response = await fetch(BASE_SERVER_URL + '/nocors.php?json=database&noache=' + (new Date().getTime()));
    return await response.text();
}


async function saveToBackend2() {
    let saveTask = JSON.stringify(allTasks);
    let saveUser = JSON.stringify(selectedUsers);
    await backend.setItem('saveTask', saveTask);
    await backend.setItem('saveUser', saveUser);
}


async function loadFromBackend2() {
    let saveTask = await backend.getItem('saveTask');
    let saveUser = await backend.getItem('saveUser');
    allTasks = JSON.parse(saveTask) || [];
    selectedUsers = JSON.parse(saveUser) || [];
}


async function addAvartar() {
    let avatarPicker = document.getElementById('avartarPicker');
    avatarPicker.innerHTML = '';
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        avatarPicker.innerHTML += /*html*/ `
        <div id="user-${i}" onclick="selectUser(${i})" class="userContain">
        <img src="img/${user['img']}" class="avatar ">
        <p class="userNames">${user['name']} </p>
        </div>
        `;
    }
}


function selectUser(i) {
    let user = document.getElementById('user-' + i);
    if (user.className == 'userContain') {
        setUsersPointerEvents('none');
        user.style.pointerEvents = 'auto';
    } else if (user.className == 'userContain avarta-selected') {
        setUsersPointerEvents('auto');
    }
    user.classList.toggle('avarta-selected');

    u = i;
    if (userSelected == true) {
        userSelected
    }
}


function setUsersPointerEvents(s) {
    let user_tmp = "";
    for (let n = 0; n < users.length; n++) {
        user_tmp = document.getElementById('user-' + n);
        user_tmp.style.pointerEvents = s;
    }
}


async function resetUsers() {
    let user_tmp = "";
    for (let n = 0; n < users.length; n++) {
        user_tmp = document.getElementById('user-' + n);
        user_tmp.style.pointerEvents = 'auto';
        if (user_tmp.className == 'userContain avarta-selected') {
            user_tmp.classList.toggle('avarta-selected');
        }
    }
}


async function createNewTask() {
    await pushInputFolder();
    await backNewTask();
    s = "test";
    window.location.assign("./backlog.html");
}


async function backNewTask() {
    resetUsers();
}


async function pushInputFolder() {
    selectedUsers = [];
    allTasks = [];
    await downloadFromServer2();
    await loadFromBackend2();
    formField();
    titel.value = '';
    category.value = '';
    description.value = '';
    date.value = '';
    urgancy.value = '';
    await saveToBackend2();
}


function formField() {
    let titel = document.getElementById('inputTitel');
    let category = document.getElementById('inputCategory');
    let description = document.getElementById('inputDescription');
    let date = document.getElementById('inputDate');
    let urgancy = document.getElementById('inputUrgency');
    let task = {
        'Titel': titel.value,
        'Category': category.value,
        'Description': description.value,
        'Date': date.value,
        'Urgency': urgancy.value,
        'processing_state': 'backlog',
        'processing_state_style': 'Backlog'
    };
    allTasks.push(task);
    selectedUsers.push(users[u]);
}


function clearAllInputFolder() {
    document.getElementById('inputTitel').value = '';
    document.getElementById('inputCategory').value = '';
    document.getElementById('inputDescription').selectedIndex = 0;
    document.getElementById('inputDate').selectedIndex = 0;
    document.getElementById('inputUrgency').value = '';
}


async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        let file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}