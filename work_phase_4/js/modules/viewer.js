const initViewer = () => {
    const closeAllBtnM = document.getElementById("mobile-close-viewer");
    let lastFocusedElement = null;

    document.querySelectorAll(".openviewer").forEach((btn) => {
        btn.addEventListener("click", () => {
            const viewerId = btn.getAttribute("data-viewer-id");
            if (!viewerId) return;
            
            const viewer = document.getElementById(viewerId);
            lastFocusedElement = document.activeElement;

            if (viewer) {
                document.querySelectorAll(".viewer.open").forEach((v) => {
                    v.classList.remove("open");
                    v.setAttribute("aria-hidden", "true");
                });
                
                viewer.classList.add("open");
                document.body.style.overflow = "hidden";
                viewer.setAttribute("aria-hidden", "false");

                if (closeAllBtnM) {
                    closeAllBtnM.style.display = "inline-block";
                    closeAllBtnM.focus();
                }
            }
        });
    });

    // Function to close all viewers
    const closeAllViewers = () => {
        document.querySelectorAll(".viewer.open").forEach((viewer) => {
            viewer.classList.remove("open");
            viewer.setAttribute("aria-hidden", "true");
        });

        document.body.style.overflow = "auto";
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
        if (closeAllBtnM) {
            closeAllBtnM.style.display = "none";
        }
    };

    if (closeAllBtnM) {
        closeAllBtnM.addEventListener("click", closeAllViewers);
    }

    document.querySelectorAll(".desktop-close-viewer").forEach((closeBtn) => {
        closeBtn.addEventListener("click", () => {
            const viewer = closeBtn.closest(".viewer");
            if (viewer) {
                viewer.classList.remove("open");
                viewer.setAttribute("aria-hidden", "true");
                document.body.style.overflow = "auto";
                
                if (lastFocusedElement) {
                    lastFocusedElement.focus();
                }
            }
        });
    });

    // Add Escape key handler
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && document.querySelector(".viewer.open")) {
            closeAllViewers();
        }
    });

    // Add click outside handler
    document.addEventListener("click", (e) => {
        const openViewer = document.querySelector(".viewer.open");
        if (openViewer && !e.target.closest(".viewer") && !e.target.closest(".openviewer")) {
            closeAllViewers();
        }
    });
};

export { initViewer };