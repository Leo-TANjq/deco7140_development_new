/**
 * IMPORTS
 * Keep track of external modules being used
 * */
import { setupMenu } from "./modules/menu.js";
import { initViewer } from "./modules/viewer.js";
import { loadTopics } from "./modules/loadTopics.js";
import { initThumbnailLimit } from "./modules/thumbnail-limit.js";
import { initTopic } from "./modules/topic.js";
import { setSearch } from "./modules/search.js";
/**
 * CONSTANTS
 * Define values that don't change e.g. page titles, URLs, etc.
 * */

const minID = 760;
const indentifier = "new";
/**
 * VARIABLES
 * Define values that will change e.g. user inputs, counters, etc.
 * */

/**
 * FUNCTIONS
 * Group code into functions to make it reusable
 * */
// Function to create topic panels from backend data

/**
 * EVENT LISTENERS
 * The code that runs when a user interacts with the page
 * */

// when the page fully loads
document.addEventListener("DOMContentLoaded", async () => {
    // Load posts first
    setupMenu();
    const postsData = await loadTopics(minID);
    if (postsData) {
        initTopic(indentifier);
    }
    initThumbnailLimit();
    initViewer();
    setSearch();
});
