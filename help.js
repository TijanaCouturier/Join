/**
 * init function
 */
async function init() {
    await includeHTML();
    menuInit();
}


/**
 * About us
 */
function buttonUns() {
    document.getElementById('buttonUns').classList.remove('d-none');
    document.getElementById('buttonKanban').classList.add('d-none');
    document.getElementById('buttonImpressum').classList.add('d-none');
}


/**
 * Kanban
 */
function buttonKanban() {
    document.getElementById('buttonUns').classList.add('d-none');
    document.getElementById('buttonKanban').classList.remove('d-none');
    document.getElementById('buttonImpressum').classList.add('d-none');
}


/**
 * all buttons in help
 */
function buttonImpressum() {
    document.getElementById('buttonImpressum').classList.remove('d-none');
    document.getElementById('buttonKanban').classList.add('d-none');
    document.getElementById('buttonUns').classList.add('d-none');
}


/**
 * includeHTML
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