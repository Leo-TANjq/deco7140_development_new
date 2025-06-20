const initGalleryViewer = () => {
    const viewer = document.getElementById("viewer");
    const viewerImg = document.getElementById("viewer-img");
    const viewerCaption = document.getElementById("viewer-caption");
    const closeBtn = document.getElementById("close-viewer");
    let lastFocusedElement = null;
    // Click on gallery image to open viewer
    document.querySelectorAll(".gallery img").forEach((img) => {
        img.addEventListener("click", () => {
            lastFocusedElement = document.activeElement;
            viewerImg.src = img.src;
            viewerImg.alt = img.alt;
            viewerCaption.textContent = img.alt;

            viewer.classList.add("open");
            viewer.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            closeBtn.focus();
        });
    });

    // Close button hides the viewer
    closeBtn.addEventListener("click", () => {
        viewer.classList.remove("open");
        viewer.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "auto";
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    });
};

export { initGalleryViewer };