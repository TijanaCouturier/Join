"use strict"
setURL('https://tijana-couturier.developerakademie.net/smallest_backend_ever');

let userSelected = false;
let selectedUsers = [];
let allTasks = [];
let userSelcheck;
let selAvatarUser;

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


/** 
 * init function to load the jsons from the backend and insert them in the todo table
 */
async function init() {
    addAvartar();
    await includeHTML();
    await downloadFromServer2();
    await loadFromBackend2();
    menuInit();

}


/** 
 * function which download all from Server
 */
async function downloadFromServer2() {
    let result = await loadJSONFromServer2();
    jsonFromServer = JSON.parse(result);
}


/*
 * function which load all (JSON) from Server
 */
async function loadJSONFromServer2() {
    let response = await fetch(BASE_SERVER_URL + '/nocors.php?json=database&noache=' + (new Date().getTime()));
    return await response.text();
}


/*
 * function which saved all tasks to backend
 */
async function saveToBackend2() {
    let saveTask = JSON.stringify(allTasks);
    let saveUser = JSON.stringify(selectedUsers);
    await backend.setItem('saveTask', saveTask);
    await backend.setItem('saveUser', saveUser);
}


/*
 *  function which loaded all tasks to backend
 */
async function loadFromBackend2() {
    let saveTask = await backend.getItem('saveTask');
    let saveUser = await backend.getItem('saveUser');
    allTasks = JSON.parse(saveTask) || [];
    selectedUsers = JSON.parse(saveUser) || [];
}


/*
 *  function which add Person in Task
 */
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


/*
 *  function which selected one User
 */
function selectUser(i) {
    let user = document.getElementById('user-' + i);
    if (user.className == 'userContain') {
        setUsersPointerEvents('none');
        user.style.pointerEvents = 'auto';
    } else if (user.className == 'userContain avarta-selected') {
        setUsersPointerEvents('auto');
    }
    user.classList.toggle('avarta-selected');

    userSelcheck = i;
    if (userSelected == true) {
        userSelected
    }
}


/*
 * Function with which a user be deactivated
 */
function setUsersPointerEvents(s) {
    let user_tmp = "";
    for (let n = 0; n < users.length; n++) {
        user_tmp = document.getElementById('user-' + n);
        user_tmp.style.pointerEvents = userSelcheck;
    }
}


/*
 * Function with which a user can no longer be selected
 */
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


/*
 * function which create new Task
 */
async function createNewTask() {
    await pushInputFolder();
    await backNewTask();
    selAvatarUser = "test";
    window.location.assign("./backlog.html");
}


/*
 * restart everything after saving
 */
async function backNewTask() {
    resetUsers();
}


/*
 * function to push input folder in backend
 */
async function pushInputFolder() {
    selectedUsers = [];
    allTasks = [];
    await downloadFromServer2();
    await loadFromBackend2();
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
    selectedUsers.push(users[userSelcheck]);

    titel.value = '';
    category.value = '';
    description.value = '';
    date.value = '';
    urgancy.value = '';
    await saveToBackend2();
}



/*
 *  function which cleared all Inputfolder
 */
function clearAllInputFolder() {
    document.getElementById('inputTitel').value = '';
    document.getElementById('inputCategory').value = '';
    document.getElementById('inputDescription').selectedIndex = 0;
    document.getElementById('inputDate').selectedIndex = 0;
    document.getElementById('inputUrgency').value = '';
}


/*
 *  function which adds the menu.html file to the board.html file
 */
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