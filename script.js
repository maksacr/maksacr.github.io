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

// DATE LOGIC
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];

const today = new Date();
document.getElementById("day").textContent = dayNames[today.getDay()];
document.getElementById("dayNum").textContent = today.getDate();
document.getElementById("month").textContent = monthNames[today.getMonth()];
