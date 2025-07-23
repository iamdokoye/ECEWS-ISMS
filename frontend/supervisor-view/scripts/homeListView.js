document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('.signout');
 
  if (button) {
    button.addEventListener('click', function () {
      window.location.href = '/frontend/userlogin/login.html';
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('.mainContainer');
    const tableBody = document.querySelector('.table-rows-container') || 
                     document.querySelector('.table');

    function checkContainerHeight() {
        if (!mainContainer || !tableBody) return;

        // Get the actual content height including padding
        const contentHeight = mainContainer.scrollHeight;
        const containerHeight = mainContainer.clientHeight;
        const viewportHeight = window.innerHeight;
        
        console.log('Content height:', contentHeight, 'Container height:', containerHeight);
        
        // Check if content exceeds container
        if (contentHeight > containerHeight) {
            mainContainer.classList.add('mainContainer--auto');
            console.log('Switching to auto height');
        } else {
            // Only revert to vh if content fits within viewport
            if (contentHeight < viewportHeight * 0.6) { // 0.6 = 60vh
                mainContainer.classList.remove('mainContainer--auto');
                console.log('Switching to fixed height');
            }
        }
    }

    // Run immediately
    checkContainerHeight();

    // Add more event listeners
    window.addEventListener('resize', checkContainerHeight);
    
    // For dynamically loaded content
    if (tableBody) {
        const observer = new MutationObserver(checkContainerHeight);
        observer.observe(tableBody, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });
    }

    // For async operations that might change height
    window.addEventListener('load', checkContainerHeight);
    
    // Export function for manual triggering
    window.dynamicHeight = {
        update: checkContainerHeight
    };
});