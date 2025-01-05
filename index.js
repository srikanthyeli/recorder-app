let video = document.querySelector("video");
let recorderBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let transparentColor = "transparent";

let recordFlag = false;
let recorder;
let chunks = [];

const constraints = {
  video: true,
  audio: false,
};

// Access user's media devices
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;
  recorder = new MediaRecorder(stream);

  recorder.addEventListener("start", () => {
    chunks = [];
  });

  recorder.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
  });

  recorder.addEventListener("stop", () => {
    let blob = new Blob(chunks, { type: "video/mp4" });
    let videoUrl = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = videoUrl;
    a.download = "stream.mp4";
    a.click();
  });

  recorderBtnCont.addEventListener("click", () => {
    if (!recorder) return;

    recordFlag = !recordFlag;
    if (recordFlag) {
      recorder.start();
      recordBtn.classList.add("scale-record");
      startTimer(); // Optional timer logic
    } else {
      recorder.stop();
      recordBtn.classList.remove("scale-record");
      stopTimer(); // Optional timer logic
    }
  });
});

// Capture a frame from the video
captureBtnCont.addEventListener("click", () => {
  captureBtnCont.classList.add("scale-capture");
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  let tool = canvas.getContext("2d");
  tool.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Apply filter
  tool.fillStyle = transparentColor;
  tool.fillRect(0, 0, canvas.width, canvas.height);

  let imageUrl = canvas.toDataURL("image/jpeg");
  let a = document.createElement("a");
  a.href = imageUrl;
  a.download = "image.jpg";
  a.click();

  setTimeout(() => {
    captureBtnCont.classList.remove("scale-capture");
  }, 500);
});

// Apply filter logic
let filter = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");

allFilters.forEach((filterElem) => {
  filterElem.addEventListener("click", () => {
    transparentColor =
      getComputedStyle(filterElem).getPropertyValue("background-color");
    filter.style.backgroundColor = transparentColor;
  });
});

let timerID;
let counter = 0;
let timer = document.querySelector(".timer");
function startTimer() {
  timer.style.display = "block";
  function displayTimer() {
    let totalSeconds = counter;
    let hours = Number.parseInt(totalSeconds / 3600);
    totalSeconds = totalSeconds % 3600;
    let minutes = Number.parseInt(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;
    let seconds = totalSeconds;

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    timer.innerText = `${hours}:${minutes}:${seconds}`;
    counter++;
  }
  timerID = setInterval(displayTimer, 1000);
}

function stopTimer() {
  clearInterval(timerID);
  timer.innerText = "00:00:00";
  timer.style.display = "none";
}
