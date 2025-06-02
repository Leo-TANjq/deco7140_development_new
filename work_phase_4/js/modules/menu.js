function setupMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const menuWrapper = document.querySelector(".menu-wrapper");
    const menuButtons = document.querySelectorAll(".menu-button");
    const submenu = document.getElementById("submenu");
    const navbar = document.querySelector("#nav-mobile");

    const data = {
        A: [
            { text: "♨️Discussion Board", url: "discussion.html" },
            { text: "♨️Chat (Coming Soon)", url: "not_prepared.html" },
        ],
        B: [
            { text: "🎑Activities", url: "activities.html" },
            { text: "🎑Recognition (Coming Soon)", url: "not_prepared.html" },
            { text: "🎑Game Board (Coming Soon)", url: "not_prepared.html" },
        ],
        C: [
            { text: "🪪Profile Page ", url: "profile.html" },
            { text: "🪪Follows & Bans (Coming Soon)", url: "not_prepared.html" },
            { text: "🪪Notifications (Coming Soon)", url: "not_prepared.html" },
        ],
        D: [
            { text: "🧰Resources (Coming Soon)", url: "not_prepared.html" },
            { text: "🧰Report", url: "report.html" },
        ],
        E: [
            { text: "📖Guidelines (Coming Soon)", url: "not_prepared.html" },
            { text: "📖Policies & Criteria (Coming Soon)", url: "not_prepared.html" },
            { text: "📖About Us", url: "about.html" },
        ],
    };

    function resetMenuState() {
        menuButtons.forEach((b) => b.classList.remove("active"));
        submenu.style.display = "none";
        menuWrapper.classList.remove("show-submenu");
        menuWrapper.classList.remove("show");
    }

    function closeMenu() {
        resetMenuState();
    }

    resetMenuState();

    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpening = !menuWrapper.classList.contains("show");
        
        if (isOpening) {
            resetMenuState();
        }
        
        menuWrapper.classList.toggle("show");
    });

    menuButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            
            menuButtons.forEach((b) => b.classList.remove("active"));
            button.classList.add("active");

            submenu.style.display = "flex";
            menuWrapper.classList.add("show-submenu");

            const category = button.dataset.category;
            const items = data[category] || [];
            submenu.innerHTML = items
                .map((item) => `<li><a href="${item.url}">${item.text}</a></li>`)
                .join("");
        });
    });

    submenu.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    document.addEventListener("click", (e) => {
        if (!navbar.contains(e.target) && menuWrapper.classList.contains("show")) {
            closeMenu();
        }
    });

    menuWrapper.addEventListener("click", (e) => {
        e.stopPropagation();
    });
}

export { setupMenu };
