function setupMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const menuWrapper = document.querySelector(".menu-wrapper");
    const menuButtons = document.querySelectorAll(".menu-button");
    const submenu = document.getElementById("submenu");
    const navbar = document.querySelector("#nav-mobile");
    

    const data = {
        A: ["🚀 1", "🛸 1-2", "🛸 1-2"],
        B: ["🐼 2"],
        C: ["⭐ 3"],
    };

    // 初始状态
    function resetMenuState() {
        menuButtons.forEach((b) => b.classList.remove("active"));
        submenu.style.display = "none";
        menuWrapper.classList.remove("show-submenu");
        menuWrapper.classList.remove("show");
    }

    // 关闭菜单的函数
    function closeMenu() {
        resetMenuState();
    }

    // 初始化时重置状态
    resetMenuState();

    // 点击菜单切换按钮
    toggle.addEventListener("click", (e) => {
        e.stopPropagation(); // 阻止事件冒泡
        const isOpening = !menuWrapper.classList.contains("show");
        
        if (isOpening) {
            resetMenuState();
        }
        
        menuWrapper.classList.toggle("show");
    });

    // 点击菜单按钮
    menuButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            
            menuButtons.forEach((b) => b.classList.remove("active"));
            button.classList.add("active");

            submenu.style.display = "flex";
            menuWrapper.classList.add("show-submenu");

            const category = button.dataset.category;
            const items = data[category];
            submenu.innerHTML = items
                .map((item) => `<li><a>${item}<a></li>`)
                .join("");
        });
    });

    // 点击子菜单项
    submenu.addEventListener("click", (e) => {
        e.stopPropagation(); // 阻止事件冒泡
    });

    // 全局点击事件监听
    document.addEventListener("click", (e) => {
        // 如果点击的不是导航栏内部元素，且菜单是展开状态，则关闭菜单
        if (!navbar.contains(e.target) && menuWrapper.classList.contains("show")) {
            closeMenu();
        }
    });

    // 防止菜单内部点击事件冒泡
    menuWrapper.addEventListener("click", (e) => {
        e.stopPropagation();
    });
}

export { setupMenu };