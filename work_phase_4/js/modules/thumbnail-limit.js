export function initThumbnailLimit() {
    function setupThumbnailLimit() {
        const thumbnailWrapper = document.getElementById("thumbnailWrapper");
        if (!thumbnailWrapper) return;

        const thumbnailContainers = thumbnailWrapper.querySelectorAll(
            ".thumbnail-container"
        );
        if (thumbnailContainers.length === 0) return;

        // Reset all thumbnails to visible first
        thumbnailContainers.forEach((container) => {
            container.style.display = "block";
            container.querySelector(".thumbnail-overlay")?.remove();
        });

        // Function to check if element is overflowing
        function isOverflowing(element) {
            const wrapperRect = thumbnailWrapper.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            return (
                elementRect.right > wrapperRect.right ||
                elementRect.left < wrapperRect.left
            );
        }

        let lastVisibleIndex = -1;
        let overflowCount = 0;

        // Find the last visible thumbnail that doesn't overflow
        for (let i = 0; i < thumbnailContainers.length; i++) {
            const container = thumbnailContainers[i];

            if (isOverflowing(container)) {
                container.style.display = "none";
                overflowCount++;
            } else {
                lastVisibleIndex = i;
            }
        }

        // If there are overflow thumbnails, add the +N indicator
        if (overflowCount > 0 && lastVisibleIndex >= 0) {
            const lastVisible = thumbnailContainers[lastVisibleIndex];
            const overlay = document.createElement("div");
            overlay.className = "thumbnail-overlay";
            overlay.textContent = `+${overflowCount}`;
            lastVisible.appendChild(overlay);
        }
    }
    setupThumbnailLimit();

    window.addEventListener("resize", setupThumbnailLimit);
}
