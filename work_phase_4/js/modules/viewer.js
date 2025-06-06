const initViewer = () => {
    const closeAllBtnM = document.getElementById("mobile-close-viewer");
    let lastFocusedElement = null;
    let currentViewer = null;

    // Setup tab navigation for a specific viewer
    const setupViewerTabNavigation = (viewer) => {
        const closeBtn = viewer.querySelector(".desktop-close-viewer");
        const accountItems = viewer.querySelectorAll(".account-item, .account"); // Modified to include both classes
        const focusableElements = [closeBtn, ...accountItems].filter(
            (el) => el
        );

        // Remove existing tab navigation
        focusableElements.forEach((el) => {
            el.removeEventListener("keydown", handleViewerKeydown);
        });

        // Add tab navigation event listeners
        focusableElements.forEach((element, index) => {
            element.setAttribute("tabindex", "0");
            element.addEventListener("keydown", (e) =>
                handleViewerKeydown(e, focusableElements, index)
            );
        });

        // Setup account item interactions
        accountItems.forEach((item) => {
            // Click handler for account selection
            item.addEventListener("click", () => {
                selectAccount(item);
            });

            // Enter/Space key handler for account selection
            item.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectAccount(item);
                }
            });
        });

        return focusableElements;
    };

    // Handle keyboard navigation within viewer
    const handleViewerKeydown = (e, focusableElements, currentIndex) => {
        let nextIndex = currentIndex;

        switch (e.key) {
            case "Tab":
                e.preventDefault();
                if (e.shiftKey) {
                    // Shift+Tab: Go to previous element (or wrap to last)
                    nextIndex =
                        currentIndex === 0
                            ? focusableElements.length - 1
                            : currentIndex - 1;
                } else {
                    // Tab: Go to next element (or wrap to first)
                    nextIndex = (currentIndex + 1) % focusableElements.length;
                }
                focusableElements[nextIndex].focus();
                break;

            case "ArrowDown":
                e.preventDefault();
                nextIndex = (currentIndex + 1) % focusableElements.length;
                focusableElements[nextIndex].focus();
                break;

            case "ArrowUp":
                e.preventDefault();
                nextIndex =
                    currentIndex === 0
                        ? focusableElements.length - 1
                        : currentIndex - 1;
                focusableElements[nextIndex].focus();
                break;

            case "Escape":
                e.preventDefault();
                closeAllViewers();
                break;

            case "Home":
                e.preventDefault();
                focusableElements[0].focus();
                break;

            case "End":
                e.preventDefault();
                focusableElements[focusableElements.length - 1].focus();
                break;
        }
    };

    // Handle account selection
    const selectAccount = (accountElement) => {
        const accountName =
            accountElement.querySelector(".name")?.textContent ||
            accountElement.querySelector("span")?.textContent ||
            accountElement.textContent;
        if (accountName) {
            console.log(`Selected account: ${accountName}`);
            closeAllViewers();
        }
    };

    // Open viewer functionality
    document.querySelectorAll(".openviewer").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const viewerId = btn.getAttribute("data-viewer-id");
            openViewer(viewerId, btn);
        });

        // Add keyboard support for viewer trigger buttons
        btn.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const viewerId = btn.getAttribute("data-viewer-id");
                openViewer(viewerId, btn);
            }
        });
    });

    // Open specific viewer
    const openViewer = (viewerId, triggerElement) => {
        if (!viewerId) return;

        const viewer = document.getElementById(viewerId);
        if (!viewer) return;

        // Store reference to element that triggered the viewer
        lastFocusedElement = triggerElement || document.activeElement;
        currentViewer = viewer;

        // Close any existing open viewers
        document.querySelectorAll(".viewer.open").forEach((v) => {
            v.classList.remove("open");
            v.setAttribute("aria-hidden", "true");
        });

        // Open the new viewer
        viewer.classList.add("open");
        document.body.style.overflow = "hidden";
        viewer.setAttribute("aria-hidden", "false");

        // Setup tab navigation for this viewer
        const focusableElements = setupViewerTabNavigation(viewer);

        // Show mobile close button
        if (closeAllBtnM) {
            closeAllBtnM.style.display = "inline-block";
        }

        // Focus on the close button (first focusable element)
        if (focusableElements.length > 0) {
            setTimeout(() => {
                focusableElements[0].focus();
            }, 100); // Small delay to ensure viewer is fully rendered
        }

        // Prevent background scrolling and trap focus
        trapFocus(viewer);
    };

    // Trap focus within the viewer
    const trapFocus = (viewer) => {
        const focusableElements = viewer.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        // Override default tab behavior for the viewer container
        viewer.addEventListener("keydown", (e) => {
            if (e.key !== "Tab") return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    };

    // Close all viewers
    const closeAllViewers = () => {
        document.querySelectorAll(".viewer.open").forEach((viewer) => {
            viewer.classList.remove("open");
            viewer.setAttribute("aria-hidden", "true");
        });

        document.body.style.overflow = "auto";
        currentViewer = null;

        // Return focus to the element that opened the viewer
        if (
            lastFocusedElement &&
            typeof lastFocusedElement.focus === "function"
        ) {
            setTimeout(() => {
                lastFocusedElement.focus();
                lastFocusedElement = null;
            }, 100);
        }

        // Hide mobile close button
        if (closeAllBtnM) {
            closeAllBtnM.style.display = "none";
        }
    };

    // Mobile close button event listener
    if (closeAllBtnM) {
        closeAllBtnM.addEventListener("click", closeAllViewers);
        closeAllBtnM.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                closeAllViewers();
            }
        });
    }

    // Desktop close button event listeners
    document.querySelectorAll(".desktop-close-viewer").forEach((closeBtn) => {
        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            closeAllViewers();
        });

        closeBtn.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                closeAllViewers();
            }
        });
    });

    // Global escape key handler
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && document.querySelector(".viewer.open")) {
            closeAllViewers();
        }
    });

    // Click outside to close handler
    document.addEventListener("click", (e) => {
        const openViewer = document.querySelector(".viewer.open");
        if (
            openViewer &&
            !e.target.closest(".viewer") &&
            !e.target.closest(".openviewer") &&
            !e.target.closest("#mobile-close-viewer")
        ) {
            closeAllViewers();
        }
    });

    // Prevent viewer content clicks from closing the viewer
    document.querySelectorAll(".viewer").forEach((viewer) => {
        viewer.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    });

    // Ensure non-open viewers are not in tab order
    const updateViewerTabIndex = () => {
        document.querySelectorAll(".viewer").forEach((viewer) => {
            const isOpen = viewer.classList.contains("open");
            const focusableElements = viewer.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            focusableElements.forEach((element) => {
                element.setAttribute("tabindex", isOpen ? "0" : "-1");
            });
        });
    };

    // Update tab indices when viewers open/close
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (
                mutation.type === "attributes" &&
                mutation.attributeName === "class"
            ) {
                updateViewerTabIndex();
            }
        });
    });

    // Observe all viewers for class changes
    document.querySelectorAll(".viewer").forEach((viewer) => {
        observer.observe(viewer, {
            attributes: true,
            attributeFilter: ["class"],
        });
    });

    // Also observe account lists for changes
    const accountListObserver = new MutationObserver((mutations) => {
        document.querySelectorAll(".viewer.open").forEach((viewer) => {
            setupViewerTabNavigation(viewer);
        });
    });

    document.querySelectorAll(".account-list").forEach((container) => {
        accountListObserver.observe(container, {
            childList: true,
            subtree: true,
        });
    });

    // Initial tab index setup
    updateViewerTabIndex();
};

export { initViewer };
