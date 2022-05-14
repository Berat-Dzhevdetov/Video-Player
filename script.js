const video = document.querySelector('video');
const videoContainer = document.querySelector('.video-container')
const playPauseBtn = document.querySelector('.play-pause-btn');

// Adding event listeners
// Play/Pause
playPauseBtn.addEventListener('click', togglePlay);

video.addEventListener("play", onVideoPlay);
video.addEventListener("pause", onVideoPause);
video.addEventListener("click", togglePlay)

document.addEventListener("keydown", e => handleUserKeyboardInteraction(e));

// Functions for the event listeners
// Play/Pause
function togglePlay() {
    video.paused ? video.play() : video.pause();
}

function onVideoPlay() {
    videoContainer.classList.remove("paused");
}

function onVideoPause() {
    videoContainer.classList.add("paused");
}

function handleUserKeyboardInteraction(e) {
    switch (e.key.toLowerCase()) {
        case "k":
        case " ":
            togglePlay();
            break;
    }
}