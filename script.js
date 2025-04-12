document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault(); // Prevents page reload
        window.open(this.href, '_blank'); // Opens the link in a new tab
    });
});

const audio = document.getElementById('audioPlayer');
const btn = document.getElementById('playPauseBtn');
let isPlaying = false;

btn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        btn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        btn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
});