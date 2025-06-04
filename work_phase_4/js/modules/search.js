export function setSearch() {
    // Get search elements
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    // Get all topic panels
    const topicPanels = document.querySelectorAll('.panel.topic');
    
    // Function to perform search
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // If search is empty, show all topics
            topicPanels.forEach(panel => {
                panel.style.display = 'flex'; // or whatever your original display value was
            });
            return;
        }
        
        topicPanels.forEach(panel => {
            const topicBox = panel.querySelector('.topic-box');
            const topicTitle = topicBox.querySelector('h2').textContent.toLowerCase();
            const topicContent = topicBox.querySelector('p').textContent.toLowerCase();
            const userName = panel.querySelector('.name').textContent.toLowerCase();
            
            // Check if search term appears in title, content or username
            if (topicTitle.includes(searchTerm) || 
                topicContent.includes(searchTerm) || 
                userName.includes(searchTerm)) {
                panel.style.display = 'flex'; // or whatever your original display value was
            } else {
                panel.style.display = 'none';
            }
        });
    }
    
    // Add event listeners
    searchButton.addEventListener('click', performSearch);
    
    // Also search when pressing Enter in the input field
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}