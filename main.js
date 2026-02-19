import html2canvas from 'html2canvas';

// --- State Management & Logic ---

function updateColor(variable, value) {
    document.documentElement.style.setProperty(variable, value);
}

function handleInputChange(event) {
    let { name, value } = event.target;

    // Handle text inputs which don't have a name attribute but have ID like "primary-text"
    if (!name && event.target.id && event.target.id.endsWith('-text')) {
        name = event.target.id.replace('-text', '');
    }

    // Update the color picker if the text input changes, or vice versa
    const isColorPicker = event.target.type === 'color';

    // If it's a color picker, the sibling is the text input (id="[name]-text")
    // If it's a text input, the sibling is the color picker (id="[name]")
    const siblingId = isColorPicker ? `${name}-text` : name;
    const siblingInput = document.getElementById(siblingId);

    if (siblingInput) {
        siblingInput.value = value;
    }

    if (name) {
        updateColor(`--${name}`, value);
        // Update light variant (15% color, 85% white) for html2canvas compatibility
        updateColor(`--${name}-light`, mixWhite(value, 0.15));
        // Update super light variant (8% color, 92% white)
        updateColor(`--${name}-super-light`, mixWhite(value, 0.08));
    }
}

// Helper to mix color with white (simulating color-mix)
function mixWhite(hex, amount) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    const rMix = Math.round(r * amount + 255 * (1 - amount));
    const gMix = Math.round(g * amount + 255 * (1 - amount));
    const bMix = Math.round(b * amount + 255 * (1 - amount));

    return `rgb(${rMix}, ${gMix}, ${bMix})`;
}

// --- Event Listeners: Color Inputs ---
const colorInputs = ['primary', 'secondary', 'tertiary', 'accent'];

colorInputs.forEach(color => {
    const picker = document.getElementById(color);
    const text = document.getElementById(`${color}-text`);

    picker.addEventListener('input', handleInputChange);
    picker.addEventListener('change', handleInputChange);
    text.addEventListener('input', handleInputChange);
    text.addEventListener('change', handleInputChange);

    // Initialize on load
    updateColor(`--${color}`, picker.value);
    updateColor(`--${color}-light`, mixWhite(picker.value, 0.15));
    updateColor(`--${color}-super-light`, mixWhite(picker.value, 0.08));
});

// --- Event Listeners: Navigation ---

const landingView = document.getElementById('landing-view');
const dashboardView = document.getElementById('dashboard-view');
const testColorsBtn = document.getElementById('test-btn');
const backBtn = document.getElementById('back-btn');

testColorsBtn.addEventListener('click', () => {
    landingView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
});

backBtn.addEventListener('click', () => {
    dashboardView.classList.add('hidden');
    landingView.classList.remove('hidden');
});

// --- Event Listeners: Logo Upload ---

const logoUpload = document.getElementById('logo-upload');
const dashboardLogo = document.getElementById('dashboard-logo');

logoUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            dashboardLogo.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// --- Functionality: Download ---

document.getElementById('download-btn').addEventListener('click', () => {
    const mockupCanvas = document.getElementById('mockup-canvas');

    // Slight delay to ensure rendering is complete if needed
    setTimeout(() => {
        html2canvas(mockupCanvas, {
            scale: 2, // Higher resolution
            useCORS: true, // Handle cross-origin images if necessary
            backgroundColor: null // Transparent background if supported
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'dashboard-mockup.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error('Download failed:', err);
            alert('Failed to generate mockup. Please try again.');
        });
    }, 100);
});
