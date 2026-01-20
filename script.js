const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const placeholder = document.getElementById('placeholder');
const controls = document.getElementById('controls');
const btnChange = document.getElementById('btn-change');
const btnDownload = document.getElementById('btn-download');

// Buttons for mode (currently visual only as we have one frame)
const btnIndividual = document.getElementById('btn-individual');
const btnGroup = document.getElementById('btn-group');

let userImage = null;
let frameImage = new Image();
frameImage.src = 'assets/frame_batch62.svg'; // Use SVG
frameImage.onload = () => {
    // Determine canvas size - keep high res for print
    canvas.width = 1080;
    canvas.height = 1080; // Changed to square
    drawCanvas();
};

let currentMode = 'individual'; // or 'group'

// Event Listeners
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('border-auc-gold');
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('border-auc-gold');
});
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('border-auc-gold');
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
    // Update visual state
    if (mode === 'individual') {
        btnIndividual.className = "px-6 py-2 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-md";
        btnGroup.className = "px-6 py-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all";
    } else {
        btnGroup.className = "px-6 py-2 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-md";
        btnIndividual.className = "px-6 py-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all";
    }
    // Future: Switch frame src if we have different frames
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
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (userImage) {
        // Draw user image centered and covering/containing
        // We want 'cover' behavior: fill the frame, cropping excess
        // But frame has transparency in middle... actually we want the image BEHIND the frame.
        // Canvas layers: 1. User Image (draw first), 2. Frame (draw on top)

        // Calculate scaling to "cover" the canvas
        const scale = Math.max(canvas.width / userImage.width, canvas.height / userImage.height);
        const x = (canvas.width / 2) - (userImage.width / 2) * scale;
        const y = (canvas.height / 2) - (userImage.height / 2) * scale;

        ctx.drawImage(userImage, x, y, userImage.width * scale, userImage.height * scale);
    }

    // Draw Frame on top
    if (frameImage.complete) {
        ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
    }
}