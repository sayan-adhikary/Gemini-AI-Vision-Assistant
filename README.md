# 🤖 AI Vision Assistant

> Real-time object detection and voice-powered insights — built with vanilla HTML, CSS, JavaScript, and the Gemini AI API.

Point your laptop camera at any real-world object and the assistant will **capture it, identify it with Gemini AI, display the details, and speak the answer out loud.**

Built in a 3-hour hackathon sprint using only browser-native web technologies — no frameworks required.

---

## ✨ Features

### Core
- 📷 **Live camera feed** — streams video using `navigator.mediaDevices.getUserMedia()`
- 🖼️ **One-click capture** — grabs the current frame with `<canvas>`
- 🔡 **Base64 encoding** — converts the frame with `canvas.toDataURL()`
- 🧠 **Gemini AI identification** — sends the image to the Gemini API and gets back structured object info
- 🔊 **Automatic voice narration** — speaks the result using `SpeechSynthesisUtterance`
- 🌗 **Dark / light theme toggle** — instant theme switch via CSS variables + `data-theme`

### Bonus
- 🤖 Robot-style AI assistant UI
- ⏳ Loading animations while Gemini is "thinking"
- 📊 Confidence score for each identification
- 🕘 Scan history of previously identified objects
- 💡 Fun facts about detected objects
- 🎨 Modern glassmorphism design, fully responsive
- 🖱️ Clickable buttons with hover effects and animations
- 🧠 localStorage persistence for theme preference and scan history

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (custom properties, glassmorphism, responsive layout) |
| Logic | Vanilla JavaScript (ES6+, async/await) |
| Camera | `navigator.mediaDevices.getUserMedia()` |
| Frame capture | `<canvas>` + `toDataURL()` |
| AI identification | [Gemini API](https://ai.google.dev/) |
| Voice output | Web Speech API (`SpeechSynthesisUtterance`) |

No build tools, no frameworks, no dependencies — just open the file in a browser.

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/ai-vision-assistant.git
cd ai-vision-assistant
```

### 2. Add your Gemini API key
Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey), then open `script.js` (or `app.js`) and set it:

```javascript
const GEMINI_API_KEY = "YOUR_API_KEY_HERE";
```

> ⚠️ **Never commit your real API key to a public repo.** For anything beyond a hackathon demo, load it from an environment variable or a backend proxy instead of hardcoding it client-side.

### 3. Run it locally
Because camera access requires a secure context, serve the folder instead of opening the HTML file directly:

```bash
# Using Python
python3 -m http.server 8000

# Or using Node
npx serve .

# Or using VS Code Live Server extension
```

Then open `http://localhost:8000` in your browser and allow camera access when prompted.

---

## 🧭 How It Works

```
<video>  →  <canvas>  →  toDataURL()  →  fetch()  →  Gemini AI  →  DOM update  →  SpeechSynthesis
 (live      (frame       (base64        (POST         (vision       (render        (speak
 stream)     grab)        encode)       request)      analysis)      result)       result)
```

1. The app requests camera access and streams live video into a `<video>` element.
2. When the user captures a frame, a hidden `<canvas>` draws the current video frame.
3. `canvas.toDataURL()` converts that frame into a base64-encoded image string.
4. The image (plus a structured prompt) is sent to the Gemini API via `fetch()`.
5. Gemini returns the object name, description, and confidence score as structured data.
6. The result is rendered into the UI via DOM manipulation (`querySelector`, `textContent`, etc.).
7. The same result text is passed to `SpeechSynthesisUtterance` to be spoken aloud automatically.

---

## 🧩 Key JavaScript & DOM Concepts Used

- `document.documentElement`, `querySelector()` — element selection
- `getAttribute()` / `setAttribute()` — theme toggling via `data-theme`
- `addEventListener()` — event-driven UI (capture button, theme switch)
- `textContent` — live UI updates
- `async` / `await` + `fetch()` — asynchronous Gemini API calls
- `getUserMedia()` / `toDataURL()` — camera and image capture

---

## 📂 Project Structure

```
ai-vision-assistant/
├── index.html          # App structure
├── style.css           # Glassmorphism UI, themes, animations
├── script.js           # Camera, capture, Gemini API, speech logic
└── README.md
```

---

## 🔮 Future Improvements

- 🗣️ Multiple selectable AI voice personalities
- 📸 Screenshot / download of scan results
- 🌐 Single-object detection in a single frame
- 🧠 Local storage for theme preference and scan history

---

## 👥 Team & Contributions

Built by mySelf for `AI assistant chatBot`.

| Name | Contribution |
|------|--------------|
| Sayan (Me) | All the features, UI, and logics |

I can explain the complete pipeline, from camera pixel to spoken word and all the underlying concepts.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [Google Gemini API](https://ai.google.dev/) for vision-based object identification
- Web Speech API for text-to-speech
- Built with ❤️ and vanilla JavaScript
- AI helps me a lot, but I still had to write the code myself!