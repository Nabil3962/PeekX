const video = document.getElementById("camera");
const alertBox = document.getElementById("alertBox");

// ===== PWA install logic (if you had it) =====
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // show install button if you have one
});

// ===== Load face-api.js models =====
async function loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    console.log("Tiny Face Detector loaded");
}

// ===== Start camera =====
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user", width: 640, height: 480 }
        });
        video.srcObject = stream;
        await video.play();
    } catch (err) {
        alert("Camera permission needed.");
        console.error(err);
    }
}

// ===== Detection loop =====
async function detectFaces() {
    if (video.readyState !== 4) {
        requestAnimationFrame(detectFaces);
        return;
    }

    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
    const detections = await faceapi.detectAllFaces(video, options);

    console.log("Faces detected:", detections.length);

    if (detections.length > 1) {
        alertBox.style.display = 'block';
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    } else {
        alertBox.style.display = 'none';
    }

    requestAnimationFrame(detectFaces);
}

// ===== Init =====
(async function() {
    await loadModels();
    await startCamera();
    detectFaces();
})();
