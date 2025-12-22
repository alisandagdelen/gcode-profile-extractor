// Global state
let currentProfiles = null;

// DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const infoSection = document.getElementById('infoSection');
const statsSection = document.getElementById('statsSection');
const downloadSection = document.getElementById('downloadSection');
const previewSection = document.getElementById('previewSection');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // File input events
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop events
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // Download buttons
    document.getElementById('downloadPrinter').addEventListener('click', () => {
        if (currentProfiles) {
            GcodeParser.downloadJSON(
                currentProfiles.machine,
                `${currentProfiles.machine.name}.json`
            );
        }
    });

    document.getElementById('downloadFilament').addEventListener('click', () => {
        if (currentProfiles) {
            GcodeParser.downloadJSON(
                currentProfiles.filament,
                `${currentProfiles.filament.name}.json`
            );
        }
    });

    document.getElementById('downloadProcess').addEventListener('click', () => {
        if (currentProfiles) {
            GcodeParser.downloadJSON(
                currentProfiles.process,
                `${currentProfiles.process.name}.json`
            );
        }
    });

    document.getElementById('downloadAll').addEventListener('click', () => {
        if (currentProfiles) {
            GcodeParser.downloadJSON(
                currentProfiles.machine,
                `${currentProfiles.machine.name}.json`
            );
            setTimeout(() => {
                GcodeParser.downloadJSON(
                    currentProfiles.filament,
                    `${currentProfiles.filament.name}.json`
                );
            }, 100);
            setTimeout(() => {
                GcodeParser.downloadJSON(
                    currentProfiles.process,
                    `${currentProfiles.process.name}.json`
                );
            }, 200);
        }
    });

    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
}

function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function processFile(file) {
    if (!file.name.endsWith('.gcode')) {
        alert('Please select a .gcode file');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const gcodeText = e.target.result;
        parseAndDisplay(gcodeText);
    };
    reader.readAsText(file);
}

function parseAndDisplay(gcodeText) {
    try {
        // Parse the gcode
        const config = GcodeParser.parseGcode(gcodeText);

        // Categorize settings
        currentProfiles = GcodeParser.categorizeSettings(config);

        // Update UI
        displayProfileInfo();
        displayStats();
        displayPreview('printer');

        // Show sections
        infoSection.style.display = 'block';
        statsSection.style.display = 'block';
        downloadSection.style.display = 'block';
        previewSection.style.display = 'block';

        // Smooth scroll to results
        infoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        console.error('Error parsing gcode:', error);
        alert('Error parsing gcode file. Please make sure it\'s a valid OrcaSlicer gcode file.');
    }
}

function displayProfileInfo() {
    document.getElementById('printerName').textContent = currentProfiles.machine.name;
    document.getElementById('filamentName').textContent = currentProfiles.filament.name;
    document.getElementById('processName').textContent = currentProfiles.process.name;
}

function displayStats() {
    const printerCount = Object.keys(currentProfiles.machine).length - 3; // Exclude type, from, is_custom_defined
    const filamentCount = Object.keys(currentProfiles.filament).length - 3;
    const processCount = Object.keys(currentProfiles.process).length - 3;
    const totalCount = printerCount + filamentCount + processCount;

    document.getElementById('printerCount').textContent = printerCount;
    document.getElementById('filamentCount').textContent = filamentCount;
    document.getElementById('processCount').textContent = processCount;
    document.getElementById('totalCount').textContent = totalCount;
}

function switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Display preview
    displayPreview(tabName);
}

function displayPreview(profileType) {
    let profile;
    switch (profileType) {
        case 'printer':
            profile = currentProfiles.machine;
            break;
        case 'filament':
            profile = currentProfiles.filament;
            break;
        case 'process':
            profile = currentProfiles.process;
            break;
    }

    const previewCode = document.getElementById('previewCode');
    previewCode.textContent = JSON.stringify(profile, null, 4);
}
