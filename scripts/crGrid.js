const grid = document.querySelector('.scrollable-grid');

grid.addEventListener('scroll', function() {
    const scrollTop = grid.scrollTop;
    const scrollHeight = grid.scrollHeight;
    const height = grid.clientHeight;

    if (scrollTop > 0) {
        // If we're not at the top, show top gradient
        grid.style.setProperty("--top-gradient-opacity", "1");
    } else {
        // If we're at the top, hide top gradient
        grid.style.setProperty("--top-gradient-opacity", "0");
    }

    if (scrollTop + height < scrollHeight) {
        // If we're not at the bottom, show bottom gradient
        grid.style.setProperty("--bottom-gradient-opacity", "1");
    } else {
        // If we're at the bottom, hide bottom gradient
        grid.style.setProperty("--bottom-gradient-opacity", "0");
    }
});

// Trigger the event to set the initial state
grid.dispatchEvent(new Event('scroll'));
