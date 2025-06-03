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
}
