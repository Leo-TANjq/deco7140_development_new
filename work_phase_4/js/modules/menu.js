export  function setupMenu() {
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
            { text: "🧰Resources", url: "resources.html" },
            { text: "🧰Report (Coming Soon)", url: "report.html" },
        ],
        E: [
            { text: "📖Guidelines (Coming Soon)", url: "not_prepared.html" },
            {
                text: "📖Policies & Criteria (Coming Soon)",
                url: "not_prepared.html",
            },
            { text: "📖About Us", url: "about.html" },
        ],
    };

    function resetMenuState() {
        menuButtons.forEach((b) => {
            b.classList.remove("active");
            b.classList.remove("current-page");
        });
        submenu.style.display = "none";
        menuWrapper.classList.remove("show-submenu");
        menuWrapper.classList.remove("show");
    }

    function closeMenu() {
        resetMenuState();
        // 保持当前页面状态
        setCurrentPageState();
    }

    function setCurrentPageState() {
        const currentPage =
            window.location.pathname.split("/").pop() || "index.html";

        // 如果是首页，不显示任何活动状态
        if (currentPage === "index.html" || currentPage === "") {
            return;
        }

        // 查找当前页面对应的菜单项
        for (const category in data) {
            const items = data[category];
            const currentItem = items.find((item) => item.url === currentPage);

            if (currentItem) {
                const button = document.querySelector(
                    `.menu-button[data-category="${category}"]`
                );

                // 标记当前页面的主分类
                button.classList.add("current-page");

                // 当菜单展开时显示子菜单并标记当前项
                if (menuWrapper.classList.contains("show")) {
                    button.classList.add("active");
                    submenu.style.display = "flex";
                    menuWrapper.classList.add("show-submenu");

                    submenu.innerHTML = items
                        .map((item) => {
                            const isCurrentPage = item.url === currentPage;
                            return `<li><a href="${item.url}" ${
                                isCurrentPage ? 'class="current-page"' : ""
                            }>${item.text}</a></li>`;
                        })
                        .join("");
                }
                break;
            }
        }
    }

    resetMenuState();
    setCurrentPageState();

    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpening = !menuWrapper.classList.contains("show");

        if (isOpening) {
            resetMenuState();
        }

        menuWrapper.classList.toggle("show");

        // 菜单打开后设置当前页面状态
        if (menuWrapper.classList.contains("show")) {
            setCurrentPageState();
        }
    });

    menuButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();

            // 清除活动状态但保持当前页面标识
            menuButtons.forEach((b) => b.classList.remove("active"));
            button.classList.add("active");

            submenu.style.display = "flex";
            menuWrapper.classList.add("show-submenu");

            const category = button.dataset.category;
            const items = data[category] || [];
            const currentPage =
                window.location.pathname.split("/").pop() || "index.html";

            submenu.innerHTML = items
                .map((item) => {
                    const isCurrentPage = item.url === currentPage;
                    return `<li><a href="${item.url}" ${
                        isCurrentPage ? 'class="current-page"' : ""
                    }>${item.text}</a></li>`;
                })
                .join("");
        });
    });

    submenu.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    document.addEventListener("click", (e) => {
        if (
            !navbar.contains(e.target) &&
            menuWrapper.classList.contains("show")
        ) {
            closeMenu();
        }
    });

    menuWrapper.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // 为桌面版菜单设置当前页面标识
    function setDesktopCurrentPageState() {
        const currentPage =
            window.location.pathname.split("/").pop() || "index.html";

        if (currentPage === "index.html" || currentPage === "") {
            return;
        }

        // 查找当前页面对应的桌面版菜单项
        for (const category in data) {
            const items = data[category];
            const currentItem = items.find((item) => item.url === currentPage);

            if (currentItem) {
                // 标记对应的主分类
                const desktopNavItems = document.querySelectorAll(
                    "#nav-desktop ul > li"
                );
                const categoryIndex = Object.keys(data).indexOf(category);

                if (desktopNavItems[categoryIndex]) {
                    desktopNavItems[categoryIndex].classList.add(
                        "current-page"
                    );
                }

                // 标记对应的子菜单项
                const linkCards = document.querySelectorAll(
                    "#nav-desktop a.link-card"
                );
                linkCards.forEach((card) => {
                    if (card.getAttribute("href") === currentPage) {
                        card.classList.add("current-page");
                        card.style.position = "relative";
                    }
                });

                break;
            }
        }
    }

    // 初始化桌面版当前页面状态
    setDesktopCurrentPageState();
}
