function initToggle() {
    const buttons = document.querySelectorAll(".type-toggle button");
    const lists = document.querySelectorAll(".activities .list");

    function showList(type) {
        lists.forEach((list) => list.classList.remove("active"));

        buttons.forEach((btn) => btn.classList.remove("active"));

        const targetList = document.querySelector(`.list.${type}`);
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
    });

    showList("ongoing");
    document
        .querySelector(".link-button.jump")
        ?.addEventListener("click", function () {
            showList("ongoing");

            setTimeout(() => {
                const target = document.getElementById("featured");
                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }, 20);
        });
}

export { initToggle };
