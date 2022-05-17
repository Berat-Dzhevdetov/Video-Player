//  #region Query Selectors
const video = document.querySelector('video');
const videoContainer = document.querySelector('.video-container')

const playPauseBtn = document.querySelector('.play-pause-btn');
const theaterBtn = document.querySelector('.theater-player-btn');
const miniPlayerBtn = document.querySelector('.mini-player-btn');
const fullScreenBtn = document.querySelector('.full-screen-player-btn');

const mutedBtn = document.querySelector('.mute-btn');
const volumeSlider = document.querySelector('.volume-slider');

const currentTimeElem = document.querySelector('.current-time');
const totalTimeElem = document.querySelector('.total-time');
const leftPart = document.querySelector('.left-part');
const rightPart = document.querySelector('.right-part');

const listOfSpeeds = document.querySelectorAll('.choose-speed-list li');
const speedBtn = document.querySelector('.speed-btn');

const timelineContainer = document.querySelector('.timeline-container');
//  #endregion Query Selectors

//  #region Adding event listeners
//  #region Play/Pause
playPauseBtn.addEventListener('click', togglePlay);

video.addEventListener("play", onVideoPlay);
video.addEventListener("pause", onVideoPause);
video.addEventListener("click", togglePlay)
//  #endregion Play/Pause

//  #region View Modes
theaterBtn.addEventListener('click', toggleTheaterMode);
miniPlayerBtn.addEventListener('click', toggleMiniPlayerMode);
fullScreenBtn.addEventListener('click', toggleFullScreenMode);
document.addEventListener('fullscreenchange', toggleDocumentFullScreenMode);
document.addEventListener('enterpictureinpicture', addVideoPictureInPictureMode);
document.addEventListener('leavepictureinpicture', leaveVideoPictureInPictureMode);
//  #endregion View Modes

//  #region Volume
mutedBtn.addEventListener('click', toggleMute);
volumeSlider.addEventListener('input', e => volumeSliderValueChange(e));
video.addEventListener('volumechange', onVolumeChange);
//  #endregion Volume

//  #region Duration
video.addEventListener('loadeddata', showDuration);
video.addEventListener('timeupdate', changeCurrentTime);
videoContainer.addEventListener('dblclick', onDBLClickSkipTime);
//  #endregion Duration

//  #region Speed
listOfSpeeds.forEach(li => li.addEventListener('click', changeVideoSpeed));
//  #endregion Speed

//  #region Timeline
timelineContainer.addEventListener('mousemove', handleTimelineUpdate);
timelineContainer.addEventListener('mousedown', toggleScurbbing);
document.addEventListener('mouseup', (e) => { if (isScrubbing) toggleScurbbing(e); });
document.addEventListener('mousemove', (e) => { if (isScrubbing) handleTimelineUpdate(e); });
//  #endregion Timeline

document.addEventListener("keydown", e => handleUserKeyboardInteraction(e));
//  #endregion Adding event listeners

//  #region Functions for the event listeners
//  #region Play/Pause
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

    if (tagName === "input") return;

    switch (e.key.toLowerCase()) {
        case " ":
            if (tagName === "button") return;
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
        case "m":
            toggleMute();
            break;
        case "arrowleft":
            skip(-5);
            break;
        case "arrowright":
            skip(5);
            break;
    }
}
//  #endregion Play/Pause

//  #region View Modes
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
//  #endregion View Modes

//  #region Volume
function volumeSliderValueChange(e) {
    video.volume = e.target.value;
    video.muted = e.target.value === 0;
}

function toggleMute() {
    video.muted = !video.muted;
}

function onVolumeChange() {
    volumeSlider.value = video.volume;
    let volumeLevel;

    if (video.muted || video.volume === 0) {
        volumeSlider.value = 0;
        volumeLevel = "muted";
    } else if (video.volume >= 0.5) {
        volumeLevel = "high";
    } else {
        volumeLevel = "low";
    }

    videoContainer.dataset.volumeLevel = volumeLevel;
}
//  #endregion Volume
//  #region Duration
function showDuration() {
    totalTimeElem.textContent = formatDuration(video.duration);
}

function onDBLClickSkipTime(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const elementWidth = rect.width;
    const leftOffset = e.currentTarget.offsetLeft;

    let x = e.pageX - leftOffset;

    if (elementWidth / 2 > x) {
        skip(-5);
    } else {
        skip(5);
    }
}

function changeCurrentTime() {
    currentTimeElem.textContent = formatDuration(video.currentTime);
    const percent = video.currentTime / video.duration;
    timelineContainer.style.setProperty("--progress-position", percent);
}
//  #endregion Duration

//  #region Speed
function changeVideoSpeed(e) {
    const rateSpeed = e.currentTarget.dataset.speedLevel
    video.playbackRate = rateSpeed;
    speedBtn.innerText = `${rateSpeed}x`;
}
//  #endregion Speed
//  #region Timeline
let isScrubbing = false;
let wasPaused;
function handleTimelineUpdate(e) {
    const rect = timelineContainer.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    timelineContainer.style.setProperty("--preview-position", percent);

    if (isScrubbing) {
        e.preventDefault();
        timelineContainer.style.setProperty("--progress-position", percent);
    }
}

function toggleScurbbing(e) {
    const rect = timelineContainer.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    isScrubbing = (e.buttons & 1) === 1
    videoContainer.classList.toggle("scrubbing", isScrubbing);
    if (isScrubbing) {
        wasPaused = video.paused;
        video.pause();
    } else {
        video.currentTime = percent * video.duration;
        if (!wasPaused) video.play();
    }

    handleTimelineUpdate(e);
}
//  #endregion Timeline
//  #endregion Functions for the event listeners

// #region Help Funcitons
// #region Duration
const leadingZeroFormater = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 });

function formatDuration(time) {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);

    if (hours === 0) {
        return `${minutes}:${leadingZeroFormater.format(seconds)}`
    } else {
        return `${hours}:${leadingZeroFormater.format(minutes)}:${leadingZeroFormater.format(seconds)}`
    }
}

function skip(duration) {
    video.currentTime += duration;
}
// #endregion Duration
// #endregion Help Funcitons