import { fetchGetData } from "./getData.js";
export function getAccount(identifier = "") {
    const containers = document.querySelectorAll(".account-list");
    containers.forEach((container) => {
        container.innerHTML = "";
    });
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
                <p>No account yet? Create one and join us immediately!</p>
                <a href="profile.html" style="margin: 0"><button class="link-button" onclick="event.preventDefault(); window.location.href='profile.html'">⚜️Join Our Community</button></a>
        `;
            });
            return;
        }

        // Filter accounts based on identifier if provided
        const filteredData = identifier
            ? data.filter((member) =>
                  member.email.startsWith(`$%$${identifier}`)
              )
            : data;

        if (filteredData.length === 0) {
            containers.forEach((container) => {
                container.innerHTML = `
                <p>No account yet? Create one and join us immediately   !</p>
                <a href="profile.html" style="margin: 0"><button class="link-button" onclick="event.preventDefault(); window.location.href='profile.html'">⚜️Join Our Community</button></a>
                `;
            });
            return;
        }

        filteredData.forEach((member) => {
            const photoSrc = member.photo || "images/default.png";
            // Remove identifier from email if present
            const displayEmail = identifier
                ? member.email.replace(`$%$${identifier}`, "")
                : member.email;

            const card = document.createElement("div");
            card.className = "account";
            card.innerHTML = `
        <div class="avatar">
            <img src="${photoSrc}" alt="avatar" />
        </div>
        <div class="info">
            <div class="name">${member.name}</div>
            <div class="email">${displayEmail}</div>
        </div>
    `;

            containers.forEach((container) => {
                container.appendChild(card.cloneNode(true));
            });
        });
    });
}
