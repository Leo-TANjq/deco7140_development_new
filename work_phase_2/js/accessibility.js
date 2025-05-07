import { setupMenu } from "./modules/menu.js";
import { toggleDropdown } from "./modules/dropdown.js";
import { setupHighlightCardEffect } from "./modules/show_relevance.js";
document.addEventListener("DOMContentLoaded", () => {
    setupMenu();
});

const dropdownBtns = document.querySelectorAll(".dropdown-btn");
dropdownBtns.forEach((button) => {
    button.addEventListener("click", function () {
        toggleDropdown(this);
    });
});

setupHighlightCardEffect("interactive-highlight-accessibility");
