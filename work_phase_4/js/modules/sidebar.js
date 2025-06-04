export function initSidebar() {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("sidebar-toggle");
    const toggleIcon = document.querySelector(".toggle-icon");
    const addButton = document.getElementById('add-account');
    const viewAccount = document.querySelector('.view-account');
    const desktopCloseViewer = document.querySelector('.desktop-close-viewer');
    const mobileCloseViewer = document.getElementById('mobile-close-viewer');
    let isCollapsed = true;

    addButton.addEventListener('click', function(e) {
        e.preventDefault();
        viewAccount.style.display = 'none';
        toggleButton.style.display = 'none';
        sidebar.classList.add('show-form');
        desktopCloseViewer.style.display = 'block';
        mobileCloseViewer.style.display = 'block';
    });

    function closeFormView() {
        viewAccount.style.display = 'block';
        toggleButton.style.display = 'flex';
        sidebar.classList.remove('show-form');
        desktopCloseViewer.style.display = 'none';
        mobileCloseViewer.style.display = 'none';
    }

    desktopCloseViewer.addEventListener('click', closeFormView);
    mobileCloseViewer.addEventListener('click', closeFormView);
    desktopCloseViewer.style.display = 'none';
    mobileCloseViewer.style.display = 'none';

    function toggleSidebar() {
        if (!isCollapsed) {
            sidebar.classList.add("collapsed");
            toggleIcon.textContent = ">";
            toggleIcon.style.transform = "rotate(0)";
            toggleButton.setAttribute("aria-expanded", "false");
            isCollapsed = !isCollapsed;
        } else {
            sidebar.classList.remove("collapsed");
            toggleIcon.style.transform = "rotate(180deg)";
            toggleButton.setAttribute("aria-expanded", "true");
            isCollapsed = !isCollapsed;
        }
    }
    
    toggleButton.addEventListener("click", toggleSidebar);
    toggleSidebar()
}
