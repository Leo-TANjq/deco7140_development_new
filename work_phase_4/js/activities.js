/**
 * IMPORTS
 * Keep track of external modules being used
 * */
import { setupMenu } from "./modules/menu.js";
import { initToggle } from "./modules/type-toggle.js";
import { initTimetable } from "./modules/timetable.js";
import { initViewer } from "./modules/viewer.js";
import { getAccount } from "./modules/account.js";
import { initJoin } from "./modules/join.js";

/**
 * CONSTANTS
 * Define values that don't change e.g. page titles, URLs, etc.
 * */

const indentifier = "new";
/**
 * VARIABLES
 * Define values that will change e.g. user inputs, counters, etc.
 * */

/**
 * FUNCTIONS
 * Group code into functions to make it reusable
 * */

/**
 * EVENT LISTENERS
 * The code that runs when a user interacts with the page
 * */

// when the page fully loads
document.addEventListener("DOMContentLoaded", () => {
    setupMenu();
    initToggle();
    initTimetable();
    initViewer();
    initJoin();
    getAccount(indentifier);
});
