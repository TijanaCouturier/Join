setURL('https://tijana-couturier.developerakademie.net/smallest_backend_ever');

let users = [];
let tasks = [];
let userSelected = false;
let selectedUsers = [];
let editTaskId;
let u;
let sel;
let s;

let users_avatar = [{
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
    includeHTML();
    await downloadFromServer();
    await loadFromBackend();
    showBacklog();
}


async function saveToBackend() {
    let usersAsJSON = JSON.stringify(users);
    let tasksAsJSON = JSON.stringify(tasks);
    await backend.setItem('saveUser', usersAsJSON);
    await backend.setItem('saveTask', tasksAsJSON);
}


async function loadFromBackend() {
    //let a = await backend.deleteItem('saveUser');
    //let b = await backend.deleteItem('saveTask');
    console.log('jsonFromServer', jsonFromServer);
    let usersAsJSON = await backend.getItem('saveUser');
    let tasksAsJSON = await backend.getItem('saveTask');

    users = JSON.parse(usersAsJSON) || [];
    tasks = JSON.parse(tasksAsJSON) || [];
    console.log('Loaded', users);
    console.log('Loaded', tasks);
    //saveToBackend();
}


function selectSavedOption(id, variable) {
    Array.from(document.querySelector(`#${id}`).options).forEach(function(option_element) {
        if (option_element.value == variable) {
            option_element.selected = true;
        }
    });
}


function openDialog(id) {
    document.getElementById(id).classList.remove('d-none');
}


function closeDialog(id) {
    document.getElementById(id).classList.add('d-none');
}


function openTask(i, page) {
    openDialog(`dialog-bg-${page}`);
    document.getElementById(`dialog-content-${page}`).innerHTML = templateMoveTo(i, page);
    selectUser(users[i].name, -1);
}


async function deleteTask(i, page, backlogAlert, event) {
    tasks.splice(i, 1);
    users.splice(i, 1);
    await update(page);
    renderBacklogAlert('Deleted');
}


function renderAddTaskMessage() {
    return `
    <a href="./addTask.html" class="add-message">Currently, there is no task in backlog. You can add tasks in the "Add Task" section or move back from board.</p>
    `;
}


async function update(page) {
    switch (page) {
        case 'backlog':
            console.log('updatepage', page);
            await updateBacklog();
            break;
        case 'board':
            await updateBoard();
            break;
    }
}


async function move(i, page) {
    switch (page) {
        case 'backlog':
            tasks[i].processing_state = 'todo';
            tasks[i].processing_state_style = 'To Do';
            break;
        case 'board':
            tasks[i].processing_state = 'backlog'
            break;
    }
    await update(page);
    renderBacklogAlert('MovedToBoard');
}


async function changeTask(i, page) {
    tasks[i].Titel = document.getElementById(`change-${page}-title`).value;
    tasks[i].Category = document.getElementById(`change-${page}-category`).value;
    tasks[i].Description = document.getElementById(`change-${page}-description`).value;
    tasks[i].Date = document.getElementById(`change-${page}-date`).value;
    tasks[i].Urgency = document.getElementById(`change-${page}-urgency`).value;
    await isAvatarSelected();
}


async function isAvatarSelected() {
    if (sel != null && sel != -1) {
        users[i] = users_avatar[sel];
    }
    if (sel != null) {
        closeDialog(`dialog-bg-${page}`);
        await update(page);
    } else {
        document.getElementById('noSelected').classList.remove('d-none');
    }
}


function renderBacklogAlert(event) {
    let backlogAlert = document.getElementById('backlogalert');
    backlogAlert.innerHTML = '';
    alertCases(backlogAlert, event);
    setTimeout(() => {
        backlogAlert.innerHTML = '';
    }, 3000);
}


function alertCases(backlogAlert, event) {
    switch (event) {
        case 'MovedToBoard':
            backlogAlert.innerHTML = templateAlertMessage();
            break;
        case 'Deleted':
            backlogAlert.innerHTML = templateAlertMessage2();
            break;
        case 'Edited':
            backlogAlert.innerHTML = templateAlertMessage3();
            break;
    }
}


function templateAlertMessage() {
    return `
    <div class="card-alert slide-in"><p>Task has been pushed to the board!</p></div>
    `;
}


function templateAlertMessage2() {
    return `
    <div class="card-alert slide-in"><p>Task has been deleted!</p></div>
    `;
}


function templateAlertMessage3() {
    return `
    <div class="card-alert slide-in"><p>Task has been successfully edited!</p></div>
    `;
}


function noSelected() {
    return `
    <p> Please select one User.</p>
    `;
}


function selectUser(x, n) {
    let user = document.getElementById('user-' + x);
    if (user.className == 'avatar') {
        setUsersPointerEvents('none');
        user.style.pointerEvents = 'auto';
        sel = n;
    } else if (user.className == 'avatar avarta-selected') {
        setUsersPointerEvents('auto');
        sel = null;
    }
    user.classList.toggle('avarta-selected');
    if (userSelected == true) {
        userSelected
    }
}


function setUsersPointerEvents(s) {
    let user_tmp = "";
    for (let n = 0; n < users_avatar.length; n++) {
        user_tmp = document.getElementById('user-' + users_avatar[n].name);
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


function setEditAssignedUsers(editTasks) {
    editTasks["assignedTo"].forEach((element) => {
        document.getElementById("user-" + element).classList.add('avatar-selected');
    });
    selectedUsers = editTasks["assignedTo"];
}


function iterateUser(i) {
    let s = "";
    for (let n = 0; n < users_avatar.length; n++) {
        s = s + `<img title="${users_avatar[n].name}" id="user-${users_avatar[n].name}" onclick="selectUser('${users_avatar[n].name}', ${n})" src="img/${users_avatar[n].img}" class="avatar"></img>`
    }
    return s;
}


function templateMoveTo(i, page) {
    return `

    <div class="dialogAllBacklog" id="${page}-item-${i}">
    <form id="inputContain " onsubmit="changeTask(${i}, '${page}'); return false;" class="inputContain">
   
    <div>
       <p>TITEL</p> 
       <input  id="change-${page}-title" value = "${tasks[i].Titel}" name="text" class="inputStyle" required type="text"></input>
    </div>
    <div class="editData">
    <div class="inputBox">
        <div class="category">
            <p>CATEGORY</p>
            <select class="inputStyleD" name="text"   id="change-${page}-category">
                <option value="${tasks[i].Category}" selected hidden>${tasks[i].Category}</option>
                <option value="Sale">Sale</option>
                <option value="Marketing">Marketing</option>
                <option value="Product">Product</option>
                <option value="Management">Management</option>
            </select>
        </div>
        <div class="category">
        <p>URGENCY</p>
        <select class="inputStyleD"  id="change-${page}-urgency" name="text">
            <option value="${tasks[i].Urgency}" selected hidden>${tasks[i].Urgency}</option>    
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="Important">Important</option>
            <option value="High">High</option>
        </select>
    </div>
    </div>
    <div>
    <p>DESCRIPTION</p>
    <textarea class="inputDescriptionField" name="text" id="change-${page}-description" cols="34" rows="10" required >${tasks[i].Description}</textarea>
    </div>

    <div class="inputBox">
        <div class="width">
         <p>DUE DATE</p>
           <input   id="change-${page}-date"  value = "${tasks[i].Date}" name="date" class="inputData" required type="date">
        </div>
        <div class="width">
            <div>
                <p class="inputBox">ASSIGNED TO</p>
                <label class="d-none" id="noSelected">Please choose one or more user.</label>
                <div class="avartarPicker" id="avartarPicker">
                        ${iterateUser(i)}
                </div>
             
             </div>
             <div class="buttonContain">
                <a onclick="closeDialog('dialog-bg-${page}')" class="btn-cancel">CANCEL</a>
                <button class="move circle-plus">SAVE TASK</button>
            </div>
        </div>
     
    </div>
    </div>
    </div>
</form>
    </div>
    `;
}