document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        window.open(this.href, '_blank');
    });
});

const tracks = [
    { name: "XXXX - Lull", src: "music/Lull - WithoutDrums.mp3" },
    { name: "YYYY - Loop", src: "music/Loop - SoftCore.mp3" }
];

let currentTrack = 0;
let isPlaying = false;

const audio = document.getElementById('audioPlayer');
const btn = document.getElementById('playPauseBtn');
const switchBtn = document.getElementById('switchTrackBtn');
const trackName = document.getElementById('trackName');

// Play/Pause Button
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

// Switch Track Button
switchBtn.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % tracks.length;
    audio.src = tracks[currentTrack].src;
    trackName.textContent = tracks[currentTrack].name;
    audio.play();
    btn.innerHTML = '<i class="fas fa-pause"></i>';
    isPlaying = true;
});

let lastTap = 0;

// Detect double tap on the whole music player container
document.querySelector('.music-player-fixed').addEventListener('touchend', function(e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < 300 && tapLength > 0) {
        // Double-tap detected — switch track
        currentTrack = (currentTrack + 1) % tracks.length;
        audio.src = tracks[currentTrack].src;
        document.getElementById('trackName').textContent = tracks[currentTrack].name;
        audio.play();
        btn.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
    }

    lastTap = currentTime;
});


// DATE LOGIC
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];

const today = new Date();
document.getElementById("day").textContent = dayNames[today.getDay()];
document.getElementById("dayNum").textContent = today.getDate();
document.getElementById("month").textContent = monthNames[today.getMonth()];
