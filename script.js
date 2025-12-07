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
            video: { facingMode: "user", width: 640, height: 480 }
        });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            detectFaces(); // start detection after video is ready
        };
    } catch (err) {
        alert("Camera permission needed.");
        console.error(err);
    }
}

startCamera();

// ===== BlazeFace Face Detector =====
let detector = null;

async function initDetector() {
    detector = await blazeface.load();
    console.log("BlazeFace loaded.");
}

initDetector();

// ===== Detection Loop =====
async function detectFaces() {
    if (!detector) return requestAnimationFrame(detectFaces);

    if (video.readyState === 4) { // video ready
        const predictions = await detector.estimateFaces(video, false);
        // Log face count for debugging
        console.log("Faces detected:", predictions.length);

        if (predictions.length > 1) {
            alertBox.style.display = "block";
        } else {
            alertBox.style.display = "none";
        }
    }

    requestAnimationFrame(detectFaces);
}
