export function setupMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const menuWrapper = document.querySelector(".menu-wrapper");
    const menuButtons = document.querySelectorAll(".menu-button");
    const submenu = document.getElementById("submenu");
    const navbar = document.querySelector("#nav-mobile");

    // Menu data structure
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

    // Setup keyboard navigation for mobile menu
    function setupMobileKeyboardNavigation() {
        // Configure menu buttons for keyboard accessibility
        menuButtons.forEach((button, index) => {
            button.setAttribute("tabindex", "0");
            button.setAttribute("role", "button");
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-haspopup", "true");

            // Handle keyboard events for menu buttons
            button.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();

                    // Activate submenu for this category
                    activateSubmenu(button);

                    // Focus on first submenu item
                    const firstSubmenuLink = submenu.querySelector("a");
                    if (firstSubmenuLink) {
                        firstSubmenuLink.focus();
                    }
                }

                // Handle arrow key navigation between menu buttons
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                    e.preventDefault();
                    navigateMenuButtons(index, e.key === "ArrowDown");
                }
            });
        });

        // Setup keyboard navigation for submenu items
        submenu.addEventListener("keydown", (e) => {
            const submenuLinks = submenu.querySelectorAll("a");
            const currentLink = e.target;
            const currentIndex = Array.from(submenuLinks).indexOf(currentLink);

            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                navigateSubmenuItems(
                    submenuLinks,
                    currentIndex,
                    e.key === "ArrowDown"
                );
            }

            // Escape key to close submenu and return focus to parent button
            if (e.key === "Escape") {
                e.preventDefault();
                closeSubmenuAndFocusParent();
            }
        });
    }

    // Navigate between menu buttons using arrow keys
    function navigateMenuButtons(currentIndex, goDown) {
        let nextIndex;
        if (goDown) {
            nextIndex = (currentIndex + 1) % menuButtons.length;
        } else {
            nextIndex =
                (currentIndex - 1 + menuButtons.length) % menuButtons.length;
        }
        menuButtons[nextIndex].focus();
    }

    // Navigate between submenu items using arrow keys
    function navigateSubmenuItems(submenuLinks, currentIndex, goDown) {
        let nextIndex;
        if (goDown) {
            nextIndex = (currentIndex + 1) % submenuLinks.length;
        } else {
            nextIndex =
                (currentIndex - 1 + submenuLinks.length) % submenuLinks.length;
        }
        submenuLinks[nextIndex].focus();
    }

    // Close submenu and return focus to active menu button
    function closeSubmenuAndFocusParent() {
        const activeButton = document.querySelector(".menu-button.active");
        if (activeButton) {
            activeButton.setAttribute("aria-expanded", "false");
            activeButton.focus();
        }
        submenu.style.display = "none";
        menuWrapper.classList.remove("show-submenu");
    }

    // Setup keyboard navigation for desktop menu
    function setupDesktopKeyboardNavigation() {
        const desktopNavItems = document.querySelectorAll(
            "#nav-desktop ul > li"
        );

        desktopNavItems.forEach((navItem, index) => {
            const superclass = navItem.querySelector(".superclass");
            const subweb = navItem.querySelector(".subweb");

            if (superclass) {
                // Configure desktop nav items for keyboard accessibility
                superclass.setAttribute("tabindex", "0");
                superclass.setAttribute("role", "button");
                superclass.setAttribute("aria-expanded", "false");
                superclass.setAttribute("aria-haspopup", "true");

                // Handle keyboard events for desktop navigation
                superclass.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();

                        toggleDesktopSubmenu(
                            superclass,
                            subweb,
                            desktopNavItems
                        );
                    }

                    // Handle arrow key navigation between main nav items
                    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                        e.preventDefault();
                        navigateDesktopNavItems(
                            desktopNavItems,
                            index,
                            e.key === "ArrowRight"
                        );
                    }
                });

                // Setup keyboard navigation for desktop submenu link cards
                if (subweb) {
                    setupDesktopSubmenuNavigation(subweb, superclass);
                }
            }
        });
    }

    // Toggle desktop submenu visibility
    function toggleDesktopSubmenu(superclass, subweb, desktopNavItems) {
        const isExpanded = superclass.getAttribute("aria-expanded") === "true";

        // Close all other submenus
        desktopNavItems.forEach((item) => {
            const otherSuperclass = item.querySelector(".superclass");
            const otherSubweb = item.querySelector(".subweb");
            if (
                otherSuperclass &&
                otherSubweb &&
                otherSuperclass !== superclass
            ) {
                otherSuperclass.setAttribute("aria-expanded", "false");
                otherSubweb.style.display = "none";
            }
        });

        if (!isExpanded && subweb) {
            superclass.setAttribute("aria-expanded", "true");
            subweb.style.display = "flex";

            // Focus on first link card in submenu
            const firstLinkCard = subweb.querySelector("a.link-card");
            if (firstLinkCard) {
                firstLinkCard.focus();
            }
        } else {
            superclass.setAttribute("aria-expanded", "false");
            if (subweb) {
                subweb.style.display = "none";
            }
        }
    }

    // Navigate between desktop navigation items
    function navigateDesktopNavItems(desktopNavItems, currentIndex, goRight) {
        let nextIndex;
        if (goRight) {
            nextIndex = (currentIndex + 1) % desktopNavItems.length;
        } else {
            nextIndex =
                (currentIndex - 1 + desktopNavItems.length) %
                desktopNavItems.length;
        }

        const nextSuperclass =
            desktopNavItems[nextIndex].querySelector(".superclass");
        if (nextSuperclass) {
            nextSuperclass.focus();
        }
    }

    // Setup keyboard navigation for desktop submenu link cards
    function setupDesktopSubmenuNavigation(subweb, superclass) {
        const linkCards = subweb.querySelectorAll("a.link-card");

        linkCards.forEach((linkCard, cardIndex) => {
            linkCard.setAttribute("tabindex", "0");

            linkCard.addEventListener("keydown", (e) => {
                if (
                    e.key === "ArrowDown" ||
                    e.key === "ArrowUp" ||
                    e.key === "ArrowLeft" ||
                    e.key === "ArrowRight"
                ) {
                    e.preventDefault();

                    navigateDesktopLinkCards(
                        linkCards,
                        cardIndex,
                        e.key,
                        subweb
                    );
                }

                // Escape key to close submenu and return focus to parent
                if (e.key === "Escape") {
                    e.preventDefault();
                    superclass.setAttribute("aria-expanded", "false");
                    subweb.style.display = "none";
                    superclass.focus();
                }
            });
        });
    }

    // Navigate between desktop link cards
    function navigateDesktopLinkCards(linkCards, cardIndex, direction, subweb) {
        let nextIndex;
        const cardsPerRow = Math.floor(subweb.offsetWidth / 300); // Approximate cards per row

        switch (direction) {
            case "ArrowRight":
                nextIndex = (cardIndex + 1) % linkCards.length;
                break;
            case "ArrowLeft":
                nextIndex =
                    (cardIndex - 1 + linkCards.length) % linkCards.length;
                break;
            case "ArrowDown":
                nextIndex = Math.min(
                    cardIndex + cardsPerRow,
                    linkCards.length - 1
                );
                break;
            case "ArrowUp":
                nextIndex = Math.max(cardIndex - cardsPerRow, 0);
                break;
        }

        linkCards[nextIndex].focus();
    }

    // Activate submenu for a specific menu button
    function activateSubmenu(button) {
        // Clear active state from all buttons but keep current page identification
        menuButtons.forEach((b) => {
            b.classList.remove("active");
            b.setAttribute("aria-expanded", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-expanded", "true");

        submenu.style.display = "flex";
        menuWrapper.classList.add("show-submenu");

        const category = button.dataset.category;
        const items = data[category] || [];
        const currentPage =
            window.location.pathname.split("/").pop() || "index.html";

        submenu.innerHTML = items
            .map((item) => {
                const isCurrentPage = item.url === currentPage;
                return `<li><a href="${item.url}" tabindex="0" ${
                    isCurrentPage ? 'class="current-page"' : ""
                }>${item.text}</a></li>`;
            })
            .join("");
    }

    // Reset menu state to default
    function resetMenuState() {
        menuButtons.forEach((b) => {
            b.classList.remove("active");
            b.classList.remove("current-page");
            b.setAttribute("aria-expanded", "false");
        });
        submenu.style.display = "none";
        menuWrapper.classList.remove("show-submenu");
        menuWrapper.classList.remove("show");
    }

    // Close menu and maintain current page state
    function closeMenu() {
        resetMenuState();
        setCurrentPageState();
    }

    // Set current page state indicators
    function setCurrentPageState() {
        const currentPage =
            window.location.pathname.split("/").pop() || "index.html";

        // If it's homepage, don't show any active state
        if (currentPage === "index.html" || currentPage === "") {
            return;
        }

        // Find current page's corresponding menu item
        for (const category in data) {
            const items = data[category];
            const currentItem = items.find((item) => item.url === currentPage);

            if (currentItem) {
                const button = document.querySelector(
                    `.menu-button[data-category="${category}"]`
                );

                // Mark current page's main category
                button.classList.add("current-page");

                // When menu is expanded, show submenu and mark current item
                if (menuWrapper.classList.contains("show")) {
                    activateSubmenu(button);
                }
                break;
            }
        }
    }

    // Set current page state for desktop navigation
    function setDesktopCurrentPageState() {
        const currentPage =
            window.location.pathname.split("/").pop() || "index.html";

        if (currentPage === "index.html" || currentPage === "") {
            return;
        }

        // Find current page's corresponding desktop menu item
        for (const category in data) {
            const items = data[category];
            const currentItem = items.find((item) => item.url === currentPage);

            if (currentItem) {
                // Mark corresponding main category
                const desktopNavItems = document.querySelectorAll(
                    "#nav-desktop ul > li"
                );
                const categoryIndex = Object.keys(data).indexOf(category);

                if (desktopNavItems[categoryIndex]) {
                    desktopNavItems[categoryIndex].classList.add(
                        "current-page"
                    );
                }

                // Mark corresponding submenu item
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

    // Initialize menu state
    resetMenuState();
    setCurrentPageState();

    // Mobile menu toggle button event listener
    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpening = !menuWrapper.classList.contains("show");

        if (isOpening) {
            resetMenuState();
        }

        menuWrapper.classList.toggle("show");

        // Set current page state after menu opens
        if (menuWrapper.classList.contains("show")) {
            setCurrentPageState();
        }
    });

    // Menu button click event listeners
    menuButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            activateSubmenu(button);
        });
    });

    // Prevent submenu clicks from closing menu
    submenu.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (
            !navbar.contains(e.target) &&
            menuWrapper.classList.contains("show")
        ) {
            closeMenu();
        }
    });

    // Close menu when focus moves outside (for keyboard navigation)
    document.addEventListener("focusin", (e) => {
        if (
            !navbar.contains(e.target) &&
            menuWrapper.classList.contains("show") &&
            !menuWrapper.contains(e.target)
        ) {
            closeMenu();
        }
    });

    // Stop propagation for menu wrapper clicks
    menuWrapper.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // Initialize keyboard navigation features
    setupMobileKeyboardNavigation();
    setupDesktopKeyboardNavigation();

    // Initialize desktop current page state
    setDesktopCurrentPageState();
}
