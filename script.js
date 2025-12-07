const video = document.getElementById("camera");
const alertBox = document.getElementById("alertBox");

// PWA Install Button
let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove("hidden");
});

installBtn.addEventListener("click", async () => {
    installBtn.classList.add("hidden");
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt = null;
});

// ===== Start Front Camera =====
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" }
        });
        video.srcObject = stream;
    } catch (err) {
        alert("Camera permission needed.");
    }
}

startCamera();

// ===== Face Detection Logic =====
let useFaceAPI = true;
let detector = null;

async function initDetector() {
    if ("FaceDetector" in window) {
        detector = new FaceDetector({ fastMode: true, maxDetectedFaces: 5 });
    } else {
        useFaceAPI = false;
        detector = await blazeface.load();
    }
}

initDetector();

async function detectLoop() {
    if (!detector) return requestAnimationFrame(detectLoop);

    let faces = [];

    try {
        if (useFaceAPI) {
            faces = await detector.detect(video);
        } else {
            faces = await detector.estimateFaces(video, false);
        }
    } catch (e) { }

    if (faces.length > 1) {
        alertBox.style.display = "block";
    } else {
        alertBox.style.display = "none";
    }

    requestAnimationFrame(detectLoop);
}

detectLoop();
