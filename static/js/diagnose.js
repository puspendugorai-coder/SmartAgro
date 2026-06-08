let currentImageBase64 = null;
let remedyChartInst    = null;
let cameraStream       = null;

function handleDragOver(e)  { e.preventDefault(); document.getElementById('uploadZone').classList.add('drag-over'); }
function handleDragLeave()  { document.getElementById('uploadZone').classList.remove('drag-over'); }
function handleDrop(e)      { e.preventDefault(); document.getElementById('uploadZone').classList.remove('drag-over'); const f=e.dataTransfer.files[0]; if(f?.type.startsWith('image/')) processImageFile(f); else showToast('Please drop a valid image.','error'); }
function handleFileSelect(e){ const f=e.target.files[0]; if(f) processImageFile(f); }

function processImageFile(file) {
  if (file.size > 10*1024*1024) { showToast('Image too large. Max 10MB.','error'); return; }
  const reader = new FileReader();
  reader.onload = ev => { currentImageBase64=ev.target.result.split(',')[1]; showPreview(ev.target.result); };
  reader.readAsDataURL(file);
}

function showPreview(dataUrl) {
  document.getElementById('uploadZone').style.display  = 'none';
  const cam = document.getElementById('cameraModal');
  if (cam) cam.style.display='none';
  const prev = document.getElementById('imagePreview');
  if (prev) { prev.style.display=''; document.getElementById('previewImg').src=dataUrl; }
  const btn = document.getElementById('analyzeBtn');
  if (btn) btn.style.display='';
  resetResults();
}

function clearImage() {
  currentImageBase64=null;
  document.getElementById('uploadZone').style.display='';
  const prev=document.getElementById('imagePreview'); if(prev) prev.style.display='none';
  const btn=document.getElementById('analyzeBtn'); if(btn) btn.style.display='none';
  const fi=document.getElementById('fileInput'); if(fi) fi.value='';
  resetResults(); closeCamera();
}

function resetResults() {
  const panel = document.getElementById('resultsPanel');
  if (!panel) return;
  panel.innerHTML=`<div class="results-placeholder"><div class="placeholder-icon"><i class="fas fa-leaf"></i></div><h3>Upload a photo to start</h3><p>AI will find the disease and tell you how to treat it</p><div class="placeholder-steps"><div class="ps-item"><span class="ps-num">1</span> Upload or take photo</div><div class="ps-item"><span class="ps-num">2</span> Click Analyze</div><div class="ps-item"><span class="ps-num">3</span> Get diagnosis</div></div></div>`;
  if (remedyChartInst) { remedyChartInst.destroy(); remedyChartInst=null; }
}

async function openCamera() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}}});
    document.getElementById('cameraFeed').srcObject=cameraStream;
    document.getElementById('uploadZone').style.display='none';
    document.getElementById('cameraModal').style.display='';
    showToast('Camera ready!','success');
  } catch { showToast('Camera not available.','error'); }
}

function closeCamera() {
  if (cameraStream) { cameraStream.getTracks().forEach(t=>t.stop()); cameraStream=null; }
  const v=document.getElementById('cameraFeed'); if(v) v.srcObject=null;
  const m=document.getElementById('cameraModal'); if(m) m.style.display='none';
  if (!currentImageBase64) document.getElementById('uploadZone').style.display='';
}

function capturePhoto() {
  const video=document.getElementById('cameraFeed');
  const canvas=document.createElement('canvas');
  canvas.width=video.videoWidth||640; canvas.height=video.videoHeight||480;
  canvas.getContext('2d').drawImage(video,0,0);
  canvas.toBlob(blob=>{ closeCamera(); processImageFile(new File([blob],'capture.jpg',{type:'image/jpeg'})); showToast('📸 Photo captured!','success'); },'image/jpeg',0.92);
}

async function analyzeImage() {
  if (!currentImageBase64) { showToast('Please upload a photo first.','warning'); return; }
  const btn   = document.getElementById('analyzeBtn');
  const panel = document.getElementById('resultsPanel');
  if (btn) { btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Analyzing...'; btn.disabled=true; }
  if (panel) panel.innerHTML=`<div class="analyzing-loader"><div class="ai-loading-ring"></div><p style="color:var(--green);font-weight:700">AI is analyzing your crop...</p><p style="color:var(--text-3);font-size:0.82rem;margin-top:4px">Using Kindwise plant AI</p></div>`;
  try {
    const res  = await fetch('/api/diagnose',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image:currentImageBase64})});
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    renderDiagnosis(data);
    showToast('✅ Diagnosis complete!','success');
  } catch(err) {
    showToast('Diagnosis failed. Try again.','error');
    if (panel) panel.innerHTML=`<div class="results-placeholder"><div class="placeholder-icon" style="color:var(--red)"><i class="fas fa-circle-xmark"></i></div><h3 style="color:var(--red)">Analysis Failed</h3><p>${err.message}</p><button class="btn-secondary" style="margin-top:16px" onclick="analyzeImage()"><i class="fas fa-rotate"></i> Try Again</button></div>`;
  } finally {
    if (btn) { btn.innerHTML='<i class="fas fa-wand-magic-sparkles"></i> Analyze Crop<div class="btn-shine"></div>'; btn.disabled=false; }
  }
}

function renderDiagnosis(data) {
  const panel   = document.getElementById('resultsPanel');
  if (!panel) return;
  const isHealthy = (data.disease||'').toLowerCase().includes('healthy');
  const sevClass  = `badge-severity-${(data.severity||'mild').toLowerCase()}`;
  const ecoList   = Array.isArray(data.eco_remedies)      ? data.eco_remedies      : [];
  const chemList  = Array.isArray(data.chemical_remedies) ? data.chemical_remedies : [];
  const prevList  = Array.isArray(data.prevention)        ? data.prevention        : [];

  panel.innerHTML=`
    <div class="results-content">
      <div class="result-header">
        <div class="result-disease-name">${isHealthy?'✅':'🔬'} ${data.disease||'Unknown'}</div>
        <div class="result-meta">
          <span class="result-badge badge-confidence"><i class="fas fa-circle-check"></i> ${data.confidence||0}% Confidence</span>
          ${data.severity?`<span class="result-badge ${sevClass}">${data.severity} Severity</span>`:''}
          ${data.affected_part?`<span class="result-badge" style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);color:var(--amber)"><i class="fas fa-leaf"></i> ${data.affected_part}</span>`:''}
        </div>
      </div>
      <div class="result-body">
        ${data.cause?`<div class="result-section"><h4><i class="fas fa-circle-info"></i> Cause</h4><div class="result-cause">${data.cause}</div></div>`:''}
        ${data.recovery_timeline?`<div class="result-section"><h4><i class="fas fa-clock-rotate-left"></i> Recovery</h4><div class="result-timeline"><i class="fas fa-calendar-check"></i> ${data.recovery_timeline}</div></div>`:''}
        ${ecoList.length?`<div class="result-section"><h4><i class="fas fa-leaf"></i> Eco-Friendly Treatment <span style="font-size:0.68rem;padding:2px 8px;background:rgba(74,222,128,0.1);color:var(--green);border-radius:50px;border:1px solid rgba(74,222,128,0.2);margin-left:4px">RECOMMENDED</span></h4><div class="eco-remedies">${ecoList.map(r=>`<div class="eco-remedy-card"><div class="eco-remedy-name">🌿 ${r.remedy}</div><div class="eco-remedy-method"><i class="fas fa-hand-dots" style="color:var(--teal);margin-right:4px"></i>${r.method}</div><div class="eco-remedy-freq"><i class="fas fa-rotate" style="color:var(--text-3);margin-right:4px"></i>${r.frequency}</div><div class="eco-effectiveness"><div class="eco-effectiveness-bar" style="width:0%" data-target="${r.effectiveness||75}%"></div></div><div style="font-size:0.68rem;color:var(--text-3)">${r.effectiveness||75}% effectiveness</div></div>`).join('')}</div></div>`:''}
        ${chemList.length?`<div class="result-section"><h4><i class="fas fa-flask"></i> Chemical Treatment</h4><div class="chemical-remedies">${chemList.map(c=>`<div class="chem-item"><span class="chem-name">⚗️ ${c.name}</span><span class="chem-dose">${c.dose}</span><span style="font-size:0.72rem;color:var(--text-3)">${c.interval}</span></div>`).join('')}</div></div>`:''}
        ${prevList.length?`<div class="result-section"><h4><i class="fas fa-shield-halved"></i> Prevention</h4><ul class="prevention-list">${prevList.map(t=>`<li>${t}</li>`).join('')}</ul></div>`:''}
        <div style="padding:10px 14px;background:rgba(251,191,36,0.05);border:1px solid rgba(251,191,36,0.15);border-radius:8px;font-size:0.72rem;color:var(--text-3)"><i class="fas fa-circle-info" style="color:var(--amber);margin-right:4px"></i>AI diagnosis for guidance only. Consult a local agronomist for critical decisions.</div>
      </div>
    </div>`;

  setTimeout(() => { document.querySelectorAll('.eco-effectiveness-bar').forEach(b=>b.style.width=b.dataset.target); }, 300);
}

window.addEventListener('beforeunload', () => { if(cameraStream) cameraStream.getTracks().forEach(t=>t.stop()); });
