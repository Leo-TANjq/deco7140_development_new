/**
 * IMPORTS
 * Keep track of external modules being used
 * */
import { setupMenu } from "./modules/menu.js";
import { initToggle } from "./modules/type-toggle.js";
import { initTimetable } from "./modules/timetable.js";
import { initViewer } from "./modules/viewer.js";
import { fetchGetData } from "./modules/getData.js";
import { initJoin } from "./modules/join.js";

/**
 * CONSTANTS
 * Define values that don't change e.g. page titles, URLs, etc.
 * */

const containers = document.querySelectorAll(".account-list");
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
    fetchGetData(
        "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/",
        {
            student_number: "s4896726",
            uqcloud_zone_id: "78e5a047",
        }
    ).then((data) => {
        if (!data) {
            container.innerHTML = `
                <p class="card-text">No account found. Why not create one and be a member of us!</p>
                <a href="profile.html"><button class="link-button">⚜️Join our community</button></a>
        `;
            return;
        }

        data.forEach((member) => {
            const photoSrc =
                member.photo ||
                "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><circle cx='50' cy='30' r='20' fill='%23ccc'/><rect x='25' y='55' width='50' height='30' fill='%23ccc'/></svg>";

            const card = document.createElement("div");
            card.className = "account";
            card.innerHTML = `
        <div class="avatar">
            <img src="${photoSrc}" alt="avatar" />
        </div>
        <div class="info">
            <div class="name">${member.name}</div>
            <div class="email">${member.email}</div>
        </div>
    `;

            containers.forEach((container) => {
                container.appendChild(card.cloneNode(true));
            });
        });
    });
});
