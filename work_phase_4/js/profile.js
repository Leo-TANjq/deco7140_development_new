import { postFormData } from './modules/postFormData.js';
import { fetchGetData } from "./modules/getData.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('community-form');
    const feedback = document.getElementById('form-feedback');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        feedback.style.display = 'block';
        feedback.textContent = 'Submitting...';
        feedback.className = 'form-feedback';

        try {
            const { success, data } = await postFormData(
                form, 
                'https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/', 
                {
                    'student_number': 's4896726',
                    'uqcloud_zone_id': '78e5a047'
                }
            );

            if (success) {
                feedback.textContent = data.message || 'Submission successful!';
                feedback.className = 'form-feedback success';
                form.reset();
            } else {
                feedback.textContent = data.message || 'Submission failed. Please check your input.';
                feedback.className = 'form-feedback error';
            }
        } catch (error) {
            console.error('Submission error:', error);
            feedback.textContent = 'Network error. Please try again later.';
            feedback.className = 'form-feedback error';
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
                <p class="card-text">${member.message || "No message provided."}</p>
            </div>
        `;
            container.appendChild(card);
        });
    });
});
