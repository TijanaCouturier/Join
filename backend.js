setURL('https://tijana-couturier.developerakademie.net/smallest_backend_ever');

let users = [];
let tasks = [];
let userSelected = false;
let selectedUsers = [];
let selAvatarUser; //
let editTaskId;
let sel;


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


/** 
 * init function to load the jsons from the backend and insert them in the todo table
 */
async function init() {
    includeHTML();
    await downloadFromServer();
    await loadFromBackend();
    showBacklog();
}


/*
 * function which download all from Server
 */
async function saveToBackend() {
    let usersAsJSON = JSON.stringify(users);
    let tasksAsJSON = JSON.stringify(tasks);
    await backend.setItem('saveUser', usersAsJSON);
    await backend.setItem('saveTask', tasksAsJSON);
}


/*
 * function which load all (JSON) from Server
 */
async function loadFromBackend() {
    //let a = await backend.deleteItem('saveUser');
    //let b = await backend.deleteItem('saveTask');
    let usersAsJSON = await backend.getItem('saveUser');
    let tasksAsJSON = await backend.getItem('saveTask');

    users = JSON.parse(usersAsJSON) || [];
    tasks = JSON.parse(tasksAsJSON) || [];
    //saveToBackend();
}


/*
 * Function to select saved option
 */
function selectSavedOption(id, variable) {
    Array.from(document.querySelector(`#${id}`).options).forEach(function(option_element) {
        if (option_element.value == variable) {
            option_element.selected = true;
        }
    });
}


/*
 * Function that opens the task dialog
 */
function openDialog(id) {
    document.getElementById(id).classList.remove('d-none');
    document.body.classList.add('overflow-hidden');
}


/*
 * Function that closed the task dialog
 */
function closeDialog() {
    document.getElementById('dialog-bg-backlog').classList.add('d-none');
    document.body.classList.remove('overflow-hidden');
}


/*
 * function which open task dialog and edit task
 */
function openTask(i, page) {
    openDialog(`dialog-bg-${page}`);
    document.getElementById(`dialog-content-${page}`).innerHTML = templateMoveTo(i, page);
    selectUser(users[i].name, -1);
}


/*
 * function to delete a done task from the board
 */
async function deleteTask(i, page) {
    tasks.splice(i, 1);
    users.splice(i, 1);
    await update(page);
    renderBacklogAlert('Deleted');
}


/*
 * alert wenn kein task im backlog gespeichert ist
 */
function renderAddTaskMessage() {
    return `
    <a href="./addTask.html" class="add-message">Currently, there is no task in backlog. You can add tasks in the "Add Task" section or move back from board.</p>
    `;
}


/*
 * function that updates saved changes in the board or backlog
 */
async function update(page) {
    switch (page) {
        case 'backlog':
            await updateBacklog();
            break;
        case 'board':
            await updateBoard();
            break;
    }
}


/*
 * function which updates the json line 'processing_state' of the respective task to the id of the respective table to which the task should be moved
 */
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


/*
 * function to change and save changes in dialog in backlog
 */
async function changeTask(i, page) {
    tasks[i].Titel = document.getElementById(`change-${page}-title`).value;
    tasks[i].Category = document.getElementById(`change-${page}-category`).value;
    tasks[i].Description = document.getElementById(`change-${page}-description`).value;
    tasks[i].Date = document.getElementById(`change-${page}-date`).value;
    tasks[i].Urgency = document.getElementById(`change-${page}-urgency`).value;
    await isAvatarSelected(i, page);
}




/*
 * function that checks if a user is selected
 */
async function isAvatarSelected(i, page) {
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


/*
 * after saving a task, the task is directly saved in backlog
 */
function renderBacklogAlert(event) {
    let backlogAlert = document.getElementById('backlogalert');
    backlogAlert.innerHTML = '';
    alertCases(backlogAlert, event);
    setTimeout(() => {
        backlogAlert.innerHTML = '';
    }, 3000);
}


/*
 * Alert when a task is moved, deleted, or eded
 */
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


/*
 * Alert when a task is moved from the backlog to the board
 */
function templateAlertMessage() {
    return `
    <div class="card-alert slide-in"><p>Task has been pushed to the board!</p></div>
    `;
}


/*
 * Alert when a task is deleted
 */
function templateAlertMessage2() {
    return `
    <div class="card-alert slide-in"><p>Task has been deleted!</p></div>
    `;
}


/*
 * Alert when a task is edited
 */
function templateAlertMessage3() {
    return `
    <div class="card-alert slide-in"><p>Task has been successfully edited!</p></div>
    `;
}


/*
 * Alert if no user is selected
 */
function noSelected() {
    return `
    <p> Please select one User.</p>
    `;
}


/*
 * Function with which a user is selected
 */
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


/*
 * selected avatar User
 */
function setUsersPointerEvents(selAvatarUser) {
    let user_tmp = "";
    for (let n = 0; n < users_avatar.length; n++) {
        user_tmp = document.getElementById('user-' + users_avatar[n].name);
        user_tmp.style.pointerEvents = selAvatarUser;
    }
}


/*
 * Function with which a reset Users
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


function setEditAssignedUsers(editTasks) {
    editTasks['assignedTo'].forEach((element) => {
        document.getElementById("user-" + element).classList.add('avatar-selected');
    });
    selectedUsers = editTasks['assignedTo'];
}


function iterateUser(i) {
    let selAvatarUser = "";
    for (let n = 0; n < users_avatar.length; n++) {
        selAvatarUser = selAvatarUser + `<img title="${users_avatar[n].name}" id="user-${users_avatar[n].name}" onclick="selectUser('${users_avatar[n].name}', ${n})" src="img/${users_avatar[n].img}" class="avatar"></img>`
    }
    return selAvatarUser;
}


/*
 * template - dialog from backlog to the edited
 */
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
           <input   id="change-${page}-date"  min="${new Date().toISOString().split('T')[0]}" value = "${tasks[i].Date}" name="date" class="inputData" required type="date">
          
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