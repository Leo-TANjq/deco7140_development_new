/**
 * IMPORTS
 * Keep track of external modules being used
 * */
import { postFormData } from "./modules/postFormData.js";
import { fetchGetData } from "./modules/getData.js";
import { setupMenu } from "./modules/menu.js";
import { getAccount } from "./modules/account.js";
import { initSidebar } from "./modules/sidebar.js";

/**
 * CONSTANTS
 * Define values that don't change e.g. page titles, URLs, etc.
 * */

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
    getAccount();
    setupMenu();
    initSidebar();
    const form = document.getElementById("community-form");
    const feedback = document.getElementById("form-feedback");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        feedback.style.display = "block";
        feedback.textContent = "Submitting...";
        feedback.className = "form-feedback";

        try {
            const { success, data } = await postFormData(
                form,
                "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/",
                {
                    student_number: "s4896726",
                    uqcloud_zone_id: "78e5a047",
                }
            );
            if (success) {
                success = response.ok && data.status === "success";
            }
            if (success) {
                feedback.textContent = data.message || "Submission successful!";
                feedback.className = "form-feedback success";
                form.reset();
            } else {
                feedback.textContent =
                    data.message ||
                    "Submission failed. Please check your input.";
                feedback.className = "form-feedback error";
            }
        } catch (error) {
            console.error("Submission error:", error);
            feedback.textContent = "Network error. Please try again later.";
            feedback.className = "form-feedback error";
        }
    });

    const container = document.getElementById("community-list");

    fetchGetData(
        "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/",
        {
            student_number: "s4896726",
            uqcloud_zone_id: "78e5a047",
        }
    ).then((data) => {
        if (!data) {
            container.innerHTML =
                '<p class="text-danger">Unable to load community members.</p>';
            return;
        }

        data.forEach((member) => {
            const card = document.createElement("div");
            card.className = "self-card";
            card.innerHTML = `
            <div class="self-card">
                <h5 class="card-title">${member.name}</h5>
                <p class="card-text">${
                    member.message || "No message provided."
                }</p>
            </div>
        `;
            container.appendChild(card);
        });
    });
});