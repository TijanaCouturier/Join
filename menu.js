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
 * @param {none}
 */

function menuInit() {
    if (window.location.href == 'https://tijana-couturier.developerakademie.net/Join/board.html') {
        //addBorderToJoinHref();
        addBorderToHref('board-menu-point');
    } else if (window.location.href == 'https://tijana-couturier.developerakademie.net/Join/backlog.html') {
        //addBorderToBacklogHref();
        addBorderToHref('backlog-menu-point');
    } else if (window.location.href == 'https://tijana-couturier.developerakademie.net/Join/addTask.html') {
        //addBorderToAddTaskHref();
        addBorderToHref('addtask-menu-point');
    } else if (window.location.href == 'https://tijana-couturier.developerakademie.net/Join/help.html') {
        //addBorderToHelpHref();
        addBorderToHref('help-menu-point');
    }
}


/**
 * 
 * Function to add white border left to the in menu_param specified href in the menu
 * 
 * @param {menu_param}
 */
function addBorderToHref(menu_param) {
    document.getElementById(menu_param).classList.remove('single-href');
    document.getElementById(menu_param).classList.add('single-href-active');
}