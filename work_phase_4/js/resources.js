/**
 * IMPORTS
 * Keep track of external modules being used
 * */
import { setupMenu } from "./modules/menu.js";

/**
 * FUNCTIONS
 * Group code into functions to make it reusable
 * */
function initResourceTabs() {
    const buttons = document.querySelectorAll(".type-toggle button");
    const lists = document.querySelectorAll(".resource-list");

    function showList(type) {
        lists.forEach((list) => list.classList.remove("active"));
        buttons.forEach((btn) => btn.classList.remove("active"));

        const targetList = document.querySelector(`.resource-list.${type}`);
        const targetButton = document.querySelector(
            `.type-toggle button[data-type="${type}"]`
        );

        if (targetList) targetList.classList.add("active");
        if (targetButton) targetButton.classList.add("active");
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const type = button.getAttribute("data-type");
            showList(type);
        });


        button.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const type = button.getAttribute("data-type");
                showList(type);
            }
        });
    });


    showList("browsers");
}

/**
 * EVENT LISTENERS
 * The code that runs when a user interacts with the page
 * */
document.addEventListener("DOMContentLoaded", () => {
    setupMenu();
    initResourceTabs();
});