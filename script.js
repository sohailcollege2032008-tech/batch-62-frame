const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const placeholder = document.getElementById('placeholder');
const controls = document.getElementById('controls');
const btnChange = document.getElementById('btn-change');
const btnDownload = document.getElementById('btn-download');

// Buttons for mode (visual only)
const btnIndividual = document.getElementById('btn-individual');
const btnGroup = document.getElementById('btn-group');

let userImage = null;
let frameImage = new Image();
frameImage.crossOrigin = "Anonymous";
// Use v3 to ensure cache busting
frameImage.src = 'assets/frame_batch62.svg?v=3'; 
frameImage.onload = () => {
    canvas.width = 1080;
    canvas.height = 1080;
    drawCanvas();
};

let currentMode = 'individual';

// Event Listeners
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('border-blue-500');
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('border-blue-500');
});
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('border-blue-500');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
});

btnChange.addEventListener('click', () => fileInput.click());

btnDownload.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `batch62-graduation-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
});

btnIndividual.addEventListener('click', () => setMode('individual'));
btnGroup.addEventListener('click', () => setMode('group'));

function setMode(mode) {
    currentMode = mode;
    if (mode === 'individual') {
        btnIndividual.className = "px-6 py-2 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-md";
        btnGroup.className = "px-6 py-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all";
    } else {
        btnGroup.className = "px-6 py-2 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-md";
        btnIndividual.className = "px-6 py-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all";
    }
    drawCanvas();
}

function handleFile(file) {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        userImage = new Image();
        userImage.onload = () => {
            uploadArea.classList.remove('border-dashed');
            canvas.classList.remove('hidden');
            placeholder.classList.add('hidden');
            controls.classList.remove('hidden');
            controls.classList.add('flex');
            drawCanvas();
        };
        userImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (userImage) {
        // Center and cover
        const scale = Math.max(canvas.width / userImage.width, canvas.height / userImage.height);
        const x = (canvas.width / 2) - (userImage.width / 2) * scale;
        const y = (canvas.height / 2) - (userImage.height / 2) * scale;
        ctx.drawImage(userImage, x, y, userImage.width * scale, userImage.height * scale);
    }
    if (frameImage.complete) {
        ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
    }
}