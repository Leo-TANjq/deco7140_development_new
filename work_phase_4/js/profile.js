/**
 * IMPORTS
 * Keep track of external modules being used
 * */
import { fetchGetData } from "./modules/getData.js";
import { setupMenu } from "./modules/menu.js";
import { getAccount } from "./modules/account.js";
import { initSidebar } from "./modules/sidebar.js";
import { initForm } from "./modules/setForm.js";
import { initProfileCard } from "./modules/profileCard.js";
/**
 * CONSTANTS
 * Define values that don't change e.g. page titles, URLs, etc.
 * */
const indentifier = "test";
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
document.addEventListener("DOMContentLoaded", () => {
    getAccount(indentifier);
    setupMenu();
    initSidebar();
    initForm(indentifier);
    const profileData = fetchGetData(
        "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericuserprofile/",
        {
            student_number: "s4896726",
            uqcloud_zone_id: "78e5a047",
        }
    );
    initProfileCard(profileData, indentifier);
});
