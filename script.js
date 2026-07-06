// HTML Elements
const html = document.documentElement;
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const scanBtn = document.getElementById("scan-btn");
const speakBtn = document.getElementById("speak-btn");
const capturedImage = document.getElementById("captured-image");
const clearHistoryBtn = document.getElementById("clear-history-btn");
const downloadBtn = document.getElementById("download-btn");
const voiceSelect = document.getElementById("voice-select");
const themeBtn = document.getElementById("theme-btn");
const objectName = document.getElementById("object-name");
const objectDescription = document.getElementById("object-description");
const funFact = document.getElementById("fun-fact");
const historyList = document.getElementById("history-list");
const scanOverlay = document.getElementById("scan-overlay");

// for history
let history = [];

// voice array
let voices = [];

// last scanned IMG
let lastCapturedImage = "";

// Gemini API
const API_KEY = "YOUR_API_KEY_HERE";
const MODEL = "gemini-3.5-flash";

// store the last snaced obj
let lastResult = null;

// theme change
themeBtn.addEventListener("click", () => {
    const html = document.documentElement;
    if (html.getAttribute("data-theme") === "dark") {
        html.setAttribute("data-theme", "light");
        themeBtn.textContent = "☀️";

        //localStorage
        localStorage.setItem("theme", "light");
    } else {
        html.setAttribute("data-theme", "dark");
        themeBtn.textContent = "🌙";

        //localStorage
        localStorage.setItem("theme", "dark");
    }
});

// startCamera function
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        video.srcObject = stream;
    } catch (error) {
        console.log("Camera Error:", error);
    }
}

// load theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
    html.setAttribute("data-theme", savedTheme);
    if (savedTheme === "light") {
        themeBtn.textContent = "☀️";
    } else {
        themeBtn.textContent = "🌙";
    }
}

// startCamera function call
startCamera();

// load the page with history
loadHistory();

// Scan Button
scanBtn.addEventListener("click", captureImage);

// Capture Image
async function captureImage() {

    // Disable the Button
    scanBtn.disabled = true;
    scanBtn.textContent = "Scanning...";

    // Set canvas size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw image
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Convert image to Base64
    const imageData = canvas.toDataURL("image/jpeg");
    const base64Image = imageData.split(",")[1];

    //store the last img
    lastCapturedImage = imageData;

    try {
        scanOverlay.style.display = "flex";
        const result = await identifyObject(base64Image);
        scanOverlay.style.display = "none";

        //updated the last scaned object
        lastResult = result;

        // Save in history
        history.unshift({
            ...result,
            image: imageData
        });

        // Update history UI
        renderHistory();

        // to save history
        saveHistory();

        // Show the captured image
        capturedImage.src = imageData;
        capturedImage.style.display = "block";

        // Display AI result
        objectName.textContent = result.name;
        objectDescription.textContent = result.description;
        funFact.textContent = result.funFact;

        // Speak the result
        speakResult(result);

        //enable the button
        // scanBtn.disabled = false;
        scanBtn.textContent = "Scan Object";

    } catch (error) {

        scanOverlay.style.display = "none";

        // showing the error 
        alert("Something went wrong while identifying the object.");
        console.error(error);

        objectName.textContent = "Error";
        objectDescription.textContent = "Unable to identify the object.";
        funFact.textContent = "";

        //enable the button
        // scanBtn.disabled = false;
        scanBtn.textContent = "Scan Object";
    }
}

// Gemini Function
async function identifyObject(base64Image) {

    const prompt = `
    Identify the object in this image.

    Return ONLY JSON.

    {
        "name":"",
        "description":"",
        "funFact":""
    }
    `;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            },
                            {
                                inline_data: {
                                    mime_type: "image/jpeg",
                                    data: base64Image
                                }
                            }
                        ]
                    }
                ]
            })
        }
    );

    // Check API Response
    if (!response.ok) {
        throw new Error("Gemini API Request Failed");
    }

    const data = await response.json();

    // Check if Gemini Returned Anything
    if (!data.candidates) {
        throw new Error("No response received from Gemini.");
    }

    const text =
        data.candidates[0]
            .content.parts[0]
            .text;

    // Remove markdown if Gemini returns it
    const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(cleanedText);
}

// Create the speak function
function speakResult(result) {

    if (!("speechSynthesis" in window)) {
        alert("Text to Speech is not supported.");
        return;
    }

    // Stop previous speech
    speechSynthesis.cancel();

    const text =
        `${result.name}...${result.description}....Interesting part is ${result.funFact}`;

    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    // update voice
    const selectedVoice = voiceSelect.value;
    if (selectedVoice !== "") {
        speech.voice = voices[selectedVoice];
    }
    speechSynthesis.speak(speech);

    //enable the button
    scanBtn.disabled = false;
    scanBtn.textContent = "Scan Object";
}

// renduring the history
function renderHistory() {

    if (history.length === 0) {
        historyList.innerHTML = "<p>No objects scanned yet.</p>";
        return;
    }
    historyList.innerHTML = "";
    history.forEach(item => {

        historyList.innerHTML += `
        <div class="history-card">
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.funFact}</p>
        </div>
        `;
    });
}

// clear history function
function clearHistory() {
    const confirmDelete = confirm("Clear all scan history?");
    if (!confirmDelete) {
        return;
    }
    history = [];
    renderHistory();
    saveHistory();
}

clearHistoryBtn.addEventListener("click", clearHistory);

// downlode function
function downloadImage() {
    if (!lastCapturedImage) {
        alert("Please scan an object first.");
        return;
    }
    const link = document.createElement("a");
    link.href = lastCapturedImage;
    link.download = "captured-object.jpg";
    link.click();
}

// voice function
function loadVoices() {
    voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML =
        `<option value="">Default Voice</option>`;
    voices.forEach((voice, index) => {
        voiceSelect.innerHTML += `
            <option value="${index}">
                ${voice.name}
            </option>
        `;
    });
}

// localStorage Implementation(to save data)
function saveHistory() {
    localStorage.setItem("scanHistory", JSON.stringify(history));
}

// localStorage Implementation(to load data)
function loadHistory() {
    const savedHistory = localStorage.getItem("scanHistory");

    if (savedHistory) {
        history = JSON.parse(savedHistory);
        renderHistory();
    }
}

// load the voice
speechSynthesis.onvoiceschanged = loadVoices;

loadVoices();

//add click event to downlode
downloadBtn.addEventListener("click", downloadImage);

// Replay Button
speakBtn.addEventListener("click", () => {
    if (lastResult) {
        speakResult(lastResult);
    }
});