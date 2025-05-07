function initAccordion(containerSelector) {
    const accordions = document.querySelectorAll(containerSelector);
    
    accordions.forEach((container) => {
        if (container.dataset.accordionInitialized) return;
        container.dataset.accordionInitialized = "true";

        const headers = container.querySelectorAll(".accordion-header:not([data-accordion-handled])");
        
        headers.forEach((header) => {
            header.dataset.accordionHandled = "true"; 
            header.addEventListener("click", (e) => {
                e.stopPropagation();
                const item = header.parentElement;
                item.classList.toggle("open");
            });
        });
    });
}

export { initAccordion };