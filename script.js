const video = document.querySelector('video');
const videoContainer = document.querySelector('.video-container')
const playPauseBtn = document.querySelector('.play-pause-btn');
const theaterBtn = document.querySelector('.theater-player-btn');
const miniPlayerBtn = document.querySelector('.mini-player-btn');
const fullScreenBtn = document.querySelector('.full-screen-player-btn');

// Adding event listeners
// Play/Pause
playPauseBtn.addEventListener('click', togglePlay);

video.addEventListener("play", onVideoPlay);
video.addEventListener("pause", onVideoPause);
video.addEventListener("click", togglePlay)
// View Modes
theaterBtn.addEventListener('click', toggleTheaterMode);
miniPlayerBtn.addEventListener('click', toggleMiniPlayerMode);
fullScreenBtn.addEventListener('click', toggleFullScreenMode);
document.addEventListener('fullscreenchange', toggleDocumentFullScreenMode);
document.addEventListener('enterpictureinpicture', addVideoPictureInPictureMode);
document.addEventListener('leavepictureinpicture', leaveVideoPictureInPictureMode);

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
    const tagName = document.activeElement.tagName.toLocaleLowerCase();

    if(tagName === "input") return;

    switch (e.key.toLowerCase()) {
        case " ":
            if(tagName === "button") return;
        case "k":
            togglePlay();
            break;
        case "f":
            toggleFullScreenMode();
            break;
        case "t":
            toggleTheaterMode();
            break;
        case "i":
            toggleMiniPlayerMode();
            break;
    }
}

// View Modes
function toggleTheaterMode() {
    videoContainer.classList.toggle("theater");
}

function toggleFullScreenMode() {
    if (document.fullscreenElement == null) {
        videoContainer.requestFullscreen();
    } else {
        document.exitFullscreen()

    }
}

function toggleMiniPlayerMode() {
    if (videoContainer.classList.contains("mini-player")) {
        document.exitPictureInPicture();
    } else {
        video.requestPictureInPicture();
    }
}

function toggleDocumentFullScreenMode() {
    videoContainer.classList.toggle("full-screen", document.fullscreenElement);
}

function addVideoPictureInPictureMode() {
    videoContainer.classList.add("mini-player");
}

function leaveVideoPictureInPictureMode() {
    videoContainer.classList.remove("mini-player");
}