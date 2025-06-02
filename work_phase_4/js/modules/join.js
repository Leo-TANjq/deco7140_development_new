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
            success: response.ok,  // ✅ 更通用
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

            // 创建一个虚拟 form 元素（不插入 DOM）
            const form = document.createElement("form");

            // 添加 input 字段
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
            const endpointUrl = "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericevent/"; // ← 替换成你的实际接口
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