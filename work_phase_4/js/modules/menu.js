function setupMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const menuWrapper = document.querySelector(".menu-wrapper");
    const menuButtons = document.querySelectorAll(".menu-button");
    const submenu = document.getElementById("submenu");
    const navbar = document.querySelector("#nav-mobile");

    // data 结构改成数组内对象，包含 text 和 url
    const data = {
        A: [
            { text: "🚀 aaa", url: "https://example.com/rocket" },
            { text: "🛸 1-2", url: "https://example.com/ufo1" },
            { text: "🛸 1-2", url: "https://example.com/ufo2" },
        ],
        B: [
            { text: "🐼 2", url: "https://example.com/panda" },
        ],
        C: [
            { text: "⭐ 3", url: "https://example.com/star" },
        ],
    };

    // 初始状态
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
