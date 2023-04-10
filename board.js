setURL('https://tijana-couturier.developerakademie.net/smallest_backend_ever');

let currentDraggedElement;

/** 
 * init function to load the jsons from the backend and insert them in the todo table
 */
async function init() {
    await downloadFromServer();
    await loadFromBackend();
    await includeHTML();
    menuInit();
    showBoard();
    updateHTML();
}


/**
 * function to add all the tasks loaded out of the backend to the todo table
 */
function showBoard() {
    let tasksBoard = document.getElementById('todo');
    tasksBoard.innerHTML = '';
    for (let i = 0; i < tasks.length; i++) {
        tasksBoard.innerHTML += templateBoard(i);
    }
}


/**
 * function which open task dialog and edit task
 */
function openTask(i, page) {
    openDialog(`dialog-bg-${page}`);
    document.getElementById(`dialog-content-${page}`).innerHTML = templateMove(i, page);
}


/**
 * Function that opens the task dialog
 */
function openDialog() {
    document.getElementById('dialog-bg-backlog').classList.remove('d-none');
}


/**
 *  Function that closed the task dialog 
 */
function closeDialog() {
    document.getElementById('dialog-bg-backlog').classList.add('d-none');
}


/**
 * function to delete a done task from the board
 */
async function markAsDone(i) {
    let currentTask = document.getElementById(i);
    currentTask.remove();
    tasks.splice(i, 1);
    users.splice(i, 1);
    saveToBackend();
}

/**
 * Function to open the info menu for the current task
 */
open = true;


/**
 * Change status - move to the board or table
 */
async function changeStatus(i, page) {
    let formBoard = document.getElementById('formBoard');
    tasks[i].processing_state = document.getElementById(`statusBoard${i}`).value;
    tasks[i].processing_state_style = transformProcessState(document.getElementById(`statusBoard${i}`).value);
    saveToBackend();
    closeDialog(`dialog-bg-${page}`);
    updateHTML();
}


/**
 * transform processstate - table change
 */
function transformProcessState(prc) {
    if (prc == 'todo') {
        return 'To Do'
    } else if (prc == 'inprogress') {
        return 'In Progress'
    } else if (prc == 'testing') {
        return 'Testing'
    } else if (prc == 'done') {
        return 'Done'
    }
    return null;
}


/**
 * function which is initialized when you start dragging a task in the board and this function gives the respective id of the respective task which is being dragged as a value to the variable currentDraggedElement
 * 
 * @param {string} id - id of the respective task which is being dragged
 */
function startDragging(id) {
    currentDraggedElement = id;
}


/**
 * 
 * function which is initialized when you drop a task over a table in the board and it rewrites the settings of the respectful table/div over which the task was dropped in a way, which makes it possible for the respectful task to be placed in the respectful div/table
 * 
 * @param {event} event - which is needed to rewrite the settings of the respectful div/table to place the respectful task in the respectful div/table
 */
function allowDrop(event) {
    event.preventDefault();
}


/**
 * 
 * function which updates the json line 'processing_state' of the respective task to the id of the respective table to which the task should be moved
 * 
 * @param {id} processingState - id of the respective table to which the respective task should be moved
 */
function MoveTo(processing_state, processing_state_style) {
    tasks[currentDraggedElement].processing_state = processing_state;
    tasks[currentDraggedElement].processing_state_style = processing_state_style;
    saveToBackend();
    showBoard();
    updateHTML();
}


/**
 * function which renders all tasks after the respective tasks have received their new json lines
 */
function updateHTML() {
    document.getElementById('todo').innerHTML = '';
    document.getElementById('inprogress').innerHTML = '';
    document.getElementById('testing').innerHTML = '';
    document.getElementById('done').innerHTML = '';

    for (let i = 0; i < tasks.length; i++) {
        let element = tasks[i]['processing_state'];
        if (element == "todo" || element == "inprogress" || element == "testing" || element == "done") {
            document.getElementById(element).innerHTML += templateBoard(i);
        }
    }
}


/**
 * 
 * function which adds the menu.html file to the board.html file
 * 
 * @param {none}
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


/**
 * template function which is used for all render functions of board.js   
 * 
 * @param {number} i - respective element of the json loaded from the backend
 */

function templateBoard(i) {
    return `  
  <div class="new-task ${tasks[i]['Category']}" draggable="true" id="${i}" ondragstart="startDragging(${i})" onclick="openTask(${i}, 'backlog')"  ${tasks[i]['processing_state']}>
    <div class="new-task-inner-elements-right ">
  </div>
    <div class="new-task-text-elements">
        <div class="todo-variables"> 
        <div style= "display: flex; flex-direction: column;"> 
            <div class="todo-deadline" id="todo-deadline-${i}">${tasks[i]['Date']}</div>
            <div class="todo-title" id="todo-title-${i}"><h5 style=" font-weight: 400; font-size: 1.2rem; color: #4e4b4b;">${tasks[i]['Titel']}</h5></div>
            </div>
            <button  type="button" class="btn-close" style=" background-color: white;" aria-label="Close"><img onclick="event.stopPropagation(); markAsDone(${i})" title="delete Task" src="./img/x-icon.png"class="xICon"></button>
        </div>
        <p style="color: gray; font-size: smaller;">${tasks[i]['Description']}</p>
        <div class="new-task-details" id="new-task-details-${i}">
           
            <p class="${tasks[i]['Category']}">${tasks[i]['Category']}</p>
            <p style="margin-bottom: 0px;" href="#" >
              <img class="img" src="img/${users[i]['img']}" alt="">
            </p>
        </div>
    </div>
</div>
`;
}


function templateMove(i) {
    return ` 

    <div id="edit${i}" class="card" style="width: 18rem;">
        <div class="card-body detail-card-board">
            <button onclick="closeDialog(${i})" type="button" class="btn-close detail-btn" aria-label="Close" title="close" ><img  src="./img/x-icon.png"class="xICon"></button>
           <div>
            <p id="boardtasktitle${i}" class="card-title">${tasks[i].Titel}</p>
            <p id="boardtaskDate${i}" class="card-subtitle mb-2 text-muted">${tasks[i].Date}</p>
            <p id="boardtaskDescription${i}" class="card-text">${tasks[i].Description}</p>
            <div style="display: flex; justify-content: space-between; padding-top: 10px; padding-bottom: 10px;">
            <p id="boardtaskcategory${i}" class="border-category ${tasks[i]['Category']}">${tasks[i].Category}</p>
            <p id="boardtaskurgency${i}" class="p-${tasks[i]['Urgency']}" style="padding-right: 20px;">${tasks[i].Urgency}</p>
            </div>
            
            <div>
            <div id="boardtaskimages${i}"><img class="img" src="img/${users[i]['img']}" alt=""></div> 
            <div id="boardtaskBy${i}" style= "padding-top: 7px; padding-bottom: 7px;">${users[i].name}</div>
            <a id="boardtaskadress${i}" href="#" style="color: #108aeb;">${users[i]['email']}@join.com</a>
           </div>
           
            <form id="formBoard${i}" style="display: flex; padding-top: 35px; padding-bottom: 10px;" onsubmit="changeStatus(${i}); return false;" novalidate>
                <div class="col-md-6">
                    <label style="color: #203192; font-weight: 600;" for="validationDefault02" class="form-label">STATUS</label>
                    <select class="form-select" aria-label="Default select example" id="statusBoard${i}">
                      <option value="${tasks[i]['processing_state']}"  selected hidden> ${tasks[i]['processing_state_style']} </option>
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="testing">Testing</option>
                      <option value="done">Done</option>
                      <option value="backlog">Back to Backlog</option>
                    </select>
                </div>
                <button class="circle-plus" id="btn-create${i}">Change Status</button>
            </form>
            </div>
        </div>
    </div>
</div>
`;
}