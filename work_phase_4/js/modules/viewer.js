const initViewer = () => {
    const closeAllBtn = document.getElementById("global-close-viewer");
    let lastFocusedElement = null;
    document.querySelectorAll(".activity-block .join-button").forEach((btn) => {
        btn.addEventListener("click", () => {
            const block = btn.closest(".activity-block");
            const viewer = block.querySelector(".viewer");
            lastFocusedElement = document.activeElement;
            if (viewer) {
                viewer.classList.add("open");
                document.body.style.overflow = "hidden";
                viewer.setAttribute("aria-hidden", "false");
                if (closeAllBtn) {
                    closeAllBtn.style.display = "inline-block";
                    closeAllBtn.focus();
                }
            }
        });
    });

    if (closeAllBtn) {
        closeAllBtn.addEventListener("click", () => {
            document.querySelectorAll(".viewer.open").forEach((viewer) => {
                viewer.classList.remove("open");
                viewer.setAttribute("aria-hidden", "true");
            });
            document.body.style.overflow = "auto";
            if (lastFocusedElement) {
            lastFocusedElement.focus();
        }

            closeAllBtn.style.display = "none";
        });
    }
};

export { initViewer };
