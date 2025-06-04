import { fetchGetData } from "./getData.js";
export function getAccount() {
    const containers = document.querySelectorAll(".account-list");
    fetchGetData(
        "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/",
        {
            student_number: "s4896726",
            uqcloud_zone_id: "78e5a047",
        }
    ).then((data) => {
        if (!data) {
            containers.forEach((container) => {
                container.innerHTML = `
                <p>No account found. Why not create one and be a member of us!</p>
                <a href="profile.html" style="margin: 0"><button class="link-button" onclick="event.preventDefault(); window.location.href='profile.html'">⚜️Join Our Community</button></a>
        `;
            });
            return;
        }

        data.forEach((member) => {
            const photoSrc =
                member.photo ||
                "images/default.png";

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
}
