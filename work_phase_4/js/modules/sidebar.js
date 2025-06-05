export function initSidebar() {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("sidebar-toggle");
    const toggleIcon = document.querySelector(".toggle-icon");
    const addButton = document.getElementById("add-account");
    const viewAccount = document.querySelector(".view-account");
    const desktopCloseViewer = document.querySelector(".desktop-close-viewer");
    const mobileCloseViewer = document.getElementById("mobile-close-viewer");
    const startButton = document.getElementById("start");
    let isCollapsed = true;

    addButton.addEventListener("click", function (e) {
        e.preventDefault();
        viewAccount.style.display = "none";
        toggleButton.style.display = "none";
        sidebar.classList.add("show-form");
        desktopCloseViewer.style.display = "block";
        mobileCloseViewer.style.display = "block";
        document.removeEventListener("click", handleOutsideClick);
    });

    function closeFormView() {
        viewAccount.style.display = "block";
        toggleButton.style.display = "flex";
        sidebar.classList.remove("show-form");
        desktopCloseViewer.style.display = "none";
        mobileCloseViewer.style.display = "none";
        document.addEventListener("click", handleOutsideClick);
    }

    desktopCloseViewer.addEventListener("click", closeFormView);
    mobileCloseViewer.addEventListener("click", closeFormView);
    desktopCloseViewer.style.display = "none";
    mobileCloseViewer.style.display = "none";

    function toggleSidebar() {
        if (!isCollapsed) {
            sidebar.classList.add("collapsed");
            toggleIcon.textContent = ">";
            toggleIcon.style.transform = "rotate(0)";
            toggleButton.setAttribute("aria-expanded", "false");
            isCollapsed = !isCollapsed;
            document.body.style.overflow = "auto";
            document.removeEventListener("click", handleOutsideClick);
        } else {
            sidebar.classList.remove("collapsed");
            toggleIcon.style.transform = "rotate(180deg)";
            toggleButton.setAttribute("aria-expanded", "true");
            isCollapsed = !isCollapsed;
            document.body.style.overflow = "hidden";
            document.addEventListener("click", handleOutsideClick);
        }
    }

    function handleOutsideClick(e) {
        if (
            !sidebar.contains(e.target) &&
            !mobileCloseViewer.contains(e.target) &&
            !startButton.contains(e.target)
        )
            toggleSidebar();
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            if (sidebar.classList.contains("show-form")) {
                mobileCloseViewer.click();
            } else if (!sidebar.classList.contains("collapsed")) {
                toggleSidebar();
            }
        }
    });

    startButton.addEventListener("click", () => {
        sidebar.classList.remove("collapsed");
        toggleIcon.style.transform = "rotate(180deg)";
        toggleButton.setAttribute("aria-expanded", "true");
        isCollapsed = !isCollapsed;
        document.body.style.overflow = "hidden";
        document.addEventListener("click", handleOutsideClick);
    });

    toggleButton.addEventListener("click", toggleSidebar);
    toggleSidebar();
}
