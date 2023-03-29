/**
 * 
 * Function to open the menu 
 *  
 * @param {none}
 * */

function openMenu() {
    document.getElementById('menu').classList.remove('d-none');
}

/**
 * 
 * Function to close the menu
 * 
 * @param {none}
 */

function closeMenu() {
    document.getElementById('menu').classList.add('d-none');
}

/**
 * 
 * Function to add white border left to the respective href in the menu
 * 
 * @param {none}
 */

function menuInit() {
    if (window.location.href == 'https://tijana-couturier.developerakademie.net/Join/board.html') {
        addBorderToJoinHref();
    } else if (window.location.href == 'https://tijana-couturier.developerakademie.net/Join/backlog.html') {
        addBorderToBacklogHref();
    } else if (window.location.href == 'https://tijana-couturier.developerakademie.net/Join/addTask.html') {
        addBorderToAddTaskHref();
    } else if (window.location.href == 'https://tijana-couturier.developerakademie.net/Join/help.html') {
        addBorderToHelpHref();
    }
}


/**
 * 
 * Function to add white border left to the board href in the menu
 * 
 * @param {none}
 */

function addBorderToJoinHref() {
    document.getElementById('board-menu-point').classList.remove('single-href');
    document.getElementById('board-menu-point').classList.add('single-href-active');
}

/**
 * 
 * Function to add white border left to the backlog href in the menu
 * 
 * @param {none}
 */

function addBorderToBacklogHref() {
    document.getElementById('backlog-menu-point').classList.remove('single-href');
    document.getElementById('backlog-menu-point').classList.add('single-href-active');
}

/**
 * 
 * Function to add white border left to the addtask href in the menu
 * 
 * @param {none}
 */

function addBorderToAddTaskHref() {
    document.getElementById('addtask-menu-point').classList.remove('single-href');
    document.getElementById('addtask-menu-point').classList.add('single-href-active');
}

/**
 * 
 * Function to add white border left to the help href in the menu
 * 
 * @param {none}
 */

function addBorderToHelpHref() {
    document.getElementById('help-menu-point').classList.remove('single-href');
    document.getElementById('help-menu-point').classList.add('single-href-active');
}