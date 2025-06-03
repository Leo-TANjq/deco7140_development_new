const postFormData = async (formEl, endpointUrl, customHeaders = {}) => {
    const formData = new FormData(formEl);

    try {
        const response = await fetch(endpointUrl, {
            method: 'POST',
            headers: customHeaders,
            body: formData
        });

        const data = await response.json();

        console.log("🔍 response:", response);
        console.log("📦 returned data:", data);

        return {
            success: response.ok,
            data,
        };
    } catch (error) {
        return {
            success: false,
            data: { message: 'Network or server error.', error },
        };
    }
};
function initJoin() {
    document.querySelectorAll(".account-list").forEach((accountList) => {
        accountList.addEventListener("click", async function (e) {
            const account = e.target.closest(".account");
            if (!account) return;

            const email = account.querySelector(".email").textContent.trim();
            const activityBlock = account.closest(".activity-block");
            const eventName = activityBlock
                .querySelector(".name h3")
                .textContent.trim();


            const form = document.createElement("form");


            const fields = {
                event_name: eventName,
                location: "none",
                organiser: "none",
                event_type: "none",
                description: email,
                date_time: "2000-01-01T00:00",
            };

            for (const [name, value] of Object.entries(fields)) {
                const input = document.createElement("input");
                input.name = name;
                input.value = value;
                form.appendChild(input);
            }
            const endpointUrl = "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericevent/";
            const result = await postFormData(form, endpointUrl, {
                student_number: "s4896726",
                uqcloud_zone_id: "78e5a047",
            });

            if (result.success) {
                alert("You’re In! The organizer will send a confirmation and more details to your email soon — stay tuned!");
            } else {
                console.error("Submisson Failed", result.data);
                alert("Submisson Failed：" + result.data.message);
            }
        });
    });
}

export { initJoin };