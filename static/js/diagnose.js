/* ═══════════════════════════════════════════════
   diagnose.js — Deep AI Plant Pathology Interface
═══════════════════════════════════════════════ */

let activeImageBase64 = null;
let videoStream = null;

document.addEventListener('DOMContentLoaded', () => {
    initDragAndDrop();
    initFilePicker();
    initCameraControls();
    initAnalyzeButton();
});

/* ── Drag & Drop Utilities ─────────────────── */
function initDragAndDrop() {
    const dropZone = document.getElementById('uploadZone');
    if (!dropZone) return;

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) handleSelectedFile(files[0]);
    });
}

function initFilePicker() {
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('uploadZone');

    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) handleSelectedFile(e.target.files[0]);
        });
    }
}

/* ── Base64 Processing ─────────────────────── */
function handleSelectedFile(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Please upload a valid image file.', 'error');
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        // Strip out metadata scheme for the raw dynamic base64 standard API schema
        activeImageBase64 = reader.result.split(',')[1];
        displayImagePreview(reader.result);
    };
}

function displayImagePreview(src) {
    stopCamera();
    const zone = document.getElementById('uploadZone');
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const analyzeBtn = document.getElementById('analyzeBtn');

    if (zone) zone.style.display = 'none';
    if (preview && previewImg) {
        previewImg.src = src;
        preview.style.display = 'block';
    }
    if (analyzeBtn) analyzeBtn.style.display = 'flex';
}

function resetUploadPanel() {
    activeImageBase64 = null;
    stopCamera();

    const zone = document.getElementById('uploadZone');
    const preview = document.getElementById('imagePreview');
    const cameraModal = document.getElementById('cameraModal');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultsPanel = document.getElementById('resultsPanel');
    const placeholder = document.getElementById('resultsPlaceholder');

    if (zone) zone.style.display = 'block';
    if (preview) preview.style.display = 'none';
    if (cameraModal) cameraModal.style.display = 'none';
    if (analyzeBtn) analyzeBtn.style.display = 'none';

    // Reset viewable diagnostics container back to pristine condition
    if (resultsPanel) {
        const content = resultsPanel.querySelector('.results-content');
        if (content) content.style.display = 'none';
    }
    if (placeholder) placeholder.style.display = 'flex';
}

/* ── Camera Hardware Interface ─────────────── */
function initCameraControls() {
    const openCamBtn = document.getElementById('openCameraBtn');
    const closeCamBtn = document.getElementById('closeCameraBtn');
    const captureBtn = document.getElementById('captureBtn');

    if (openCamBtn) {
        openCamBtn.addEventListener('click', async(e) => {
            e.stopPropagation(); // Stop triggering file picker proxy
            const zone = document.getElementById('uploadZone');
            const cameraModal = document.getElementById('cameraModal');
            const video = document.getElementById('cameraFeed');

            try {
                videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
                if (zone) zone.style.display = 'none';
                if (cameraModal) cameraModal.style.display = 'block';
                if (video) {
                    video.srcObject = videoStream;
                    video.play();
                }
            } catch (err) {
                console.error('Camera capture exception:', err);
                showToast('Camera access denied or unavailable.', 'error');
            }
        });
    }

    if (closeCamBtn) closeCamBtn.addEventListener('click', resetUploadPanel);

    if (captureBtn) {
        captureBtn.addEventListener('click', () => {
            const video = document.getElementById('cameraFeed');
            if (!video || !videoStream) return;

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL('image/jpeg');
            activeImageBase64 = dataUrl.split(',')[1];
            displayImagePreview(dataUrl);
            stopCamera();
        });
    }
}

function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
}

/* ── API Processing & HTML Injection ───────── */
function initAnalyzeButton() {
    const btn = document.getElementById('analyzeBtn');
    if (!btn) return;

    btn.addEventListener('click', async() => {
        if (!activeImageBase64) {
            showToast('No diagnostic source image loaded.', 'warning');
            return;
        }

        const loader = document.getElementById('analyzingLoader');
        const placeholder = document.getElementById('resultsPlaceholder');
        const resultsContent = document.getElementById('resultsContent');

        if (placeholder) placeholder.style.display = 'none';
        if (resultsContent) resultsContent.style.display = 'none';
        if (loader) loader.style.display = 'flex';

        btn.disabled = true;
        btn.style.opacity = '0.7';

        try {
            const res = await fetch('/api/diagnose', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: activeImageBase64 })
            });

            if (!res.ok) throw new Error('Computer Vision computational crash.');
            const dynamicDiagnosis = await res.json();

            renderDiagnosisResults(dynamicDiagnosis);
            showToast('Diagnosis completed successfully!', 'success');
        } catch (err) {
            console.error(err);
            showToast('AI analysis encountered an error.', 'error');
            if (placeholder) placeholder.style.display = 'flex';
        } finally {
            if (loader) loader.style.display = 'none';
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    });
}

function renderDiagnosisResults(data) {
    const content = document.getElementById('resultsContent');
    if (!content) return;

    content.style.display = 'block';

    // Inject values structured to fit diagnose.css design exactly
    content.innerHTML = `
        <div class="result-header">
            <div class="result-disease-name">${data.disease}</div>
            <div class="result-meta">
                <span class="result-badge badge-confidence">Confidence: ${data.confidence}%</span>
                <span class="result-badge badge-severity-${data.severity.toLowerCase()}">Severity: ${data.severity}</span>
                <span class="result-badge" style="background:var(--bg-2)">Target: ${data.affected_part}</span>
            </div>
        </div>
        <div class="result-body">
            <div class="result-section">
                <h4><i class="fas fa-circle-info"></i> Primary Cause</h4>
                <div class="result-cause">${data.cause}</div>
            </div>
            
            <div class="result-section">
                <h4><i class="fas fa-leaf"></i> Ecological & Bio Remedies</h4>
                <div class="eco-remedies">
                    ${data.eco_remedies.map(eco => `
                        <div class="eco-remedy-card">
                            <div class="eco-remedy-name">${eco.remedy}</div>
                            <div class="eco-remedy-method"><strong>Method:</strong> ${eco.method}</div>
                            <div class="eco-remedy-freq"><strong>Frequency:</strong> ${eco.frequency}</div>
                            <div style="font-size:0.7rem; color:var(--text-3); margin-top:6px">Effectiveness Rating</div>
                            <div class="eco-effectiveness">
                                <div class="eco-effectiveness-bar" style="width: ${eco.effectiveness}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="result-section">
                <h4><i class="fas fa-flask"></i> Targeted Chemical Solutions</h4>
                <div class="chemical-remedies">
                    ${data.chemical_remedies.map(chem => `
                        <div class="chem-item">
                            <span class="chem-name"><i class="fas fa-pills" style="color:var(--teal); margin-right:6px"></i>${chem.name}</span>
                            <span class="chem-dose">${chem.dose} (Interval: ${chem.interval})</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="result-section">
                <h4><i class="fas fa-shield-halved"></i> Long-term Prevention Plan</h4>
                <ul class="prevention-list">
                    ${data.prevention.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>

            <div class="result-section" style="margin-top:8px">
                <div class="result-timeline">
                    <i class="fas fa-hourglass-half"></i>
                    <span><strong>Expected Recovery Window:</strong> ${data.recovery_timeline}</span>
                </div>
            </div>
        </div>
    `;
}