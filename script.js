document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault(); // Prevents page reload
        window.open(this.href, '_blank'); // Opens the link in a new tab
    });
});