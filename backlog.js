'use strict';
let emails = [{
        'email': 'tijana.couturier',
    },
    {
        'email': 'anja.hovhannisyan',
    },
    {
        'email': 'maximilian.tauber',
    },
];


async function init() {
    await downloadFromServer();
    await loadFromBackend();
    await includeHTML();
    showBacklog();
}


function showBacklog() {
    let taskList = document.getElementById('tasks');
    taskList.innerHTML = '';
    let nile = true;
    for (let i = 0; i < tasks.length; i++) {
        console.log('2');
        if (tasks[i].processing_state == 'backlog') {
            taskList.innerHTML += templateBacklog(i);
            nile = false;
        }
    }
    if (nile) {
        taskList.innerHTML += renderAddTaskMessage();
    }
    menuInit();
}


function renderAddTaskMessage() {
    return `
    <a href="./addTask.html" class="add-message">Currently, there is no task in backlog. You can add a task in the "Add Task" section.</p>
    `;
}


async function addToBord(i) {
    tasks[i].processing_state = 'todo';
    tasks[i].processing_state_style = 'To Do';
    closeDialog('dialog-bg-backlog');
    await updateBacklog();
}


async function updateBacklog() {
    showBacklog();
    await saveToBackend();
}


function templateBacklog(i) {
    return `
 <div onclick="openTask(${i}, 'backlog')" class="backlogTasks ${tasks[i]['Urgency']}" ${tasks[i]['Category']}" id="backlogTasks-${i}">
    <div class="backlogAssigned">
        <div class="avatarPerson">
            <img class="img" src="img/${users[i]['img']}" alt="">
           
            <div class="avatarPersonName">
                <span class="name">${users[i]['name']}</span>
                <span style="color: #6f8bf3f7;">${users[i]['email']}@join.com</span>
            </div>
        </div>
    </div>
    <div class="backlogCategory">
        <span class="${tasks[i]['Category']}">${tasks[i]['Category']}</span>
    </div>
    <div class="backlogDescription">
    <div>
        <span class="title-decoration">${tasks[i]['Titel']}</span>
    </div>
    <span class="description-decoration">${tasks[i]['Description']}</span>
    </div>
    <div class="contentEdit">
    <div><a  onclick="event.stopPropagation(); deleteTask(${i}, 'backlog')"><img src="img/delete.png" class="iconBacklog" title= "delete"></a></div>
    <div ><a  id="move-to-board-icon" onclick="event.stopPropagation(); move(${i}, 'backlog')"><img src="img/planner.png" class="iconBacklog" title="move to board"></a></div>
     <div><a id="backlogTasks-${i}" onclick="openTask(${i}, 'backlog')"><img title="edit Task" src="img/edit.png" class="iconBacklog"></a></div>
    </div>
 </div>`;
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