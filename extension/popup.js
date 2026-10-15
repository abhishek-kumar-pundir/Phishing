/**
 * Phish360 Chrome Extension Logic
 * Multimodal Phishing Detector & Cyber Threat Defense
 */

// Default endpoints
const DEFAULT_CONFIG = {
  apiUrl: 'http://localhost:8000',
  frontendUrl: 'http://localhost:5173'
};

// Storage helper with fallback
async function getConfig() {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    try {
      const res = await chrome.storage.local.get(['apiUrl', 'frontendUrl']);
      return {
        apiUrl: res.apiUrl || DEFAULT_CONFIG.apiUrl,
        frontendUrl: res.frontendUrl || DEFAULT_CONFIG.frontendUrl
      };
    } catch (e) {
      console.warn('Storage read fallback', e);
    }
  }
  return {
    apiUrl: localStorage.getItem('phish360_api') || DEFAULT_CONFIG.apiUrl,
    frontendUrl: localStorage.getItem('phish360_frontend') || DEFAULT_CONFIG.frontendUrl
  };
}

async function saveConfig(apiUrl, frontendUrl) {
  // Strip trailing slashes
  apiUrl = (apiUrl || DEFAULT_CONFIG.apiUrl).trim().replace(/\/+$/, '');
  frontendUrl = (frontendUrl || DEFAULT_CONFIG.frontendUrl).trim().replace(/\/+$/, '');

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    await chrome.storage.local.set({ apiUrl, frontendUrl });
  }
  localStorage.setItem('phish360_api', apiUrl);
  localStorage.setItem('phish360_frontend', frontendUrl);
  return { apiUrl, frontendUrl };
}

document.addEventListener('DOMContentLoaded', async () => {
  // UI Elements
  const scanBtn = document.getElementById('scanBtn');
  const readySection = document.getElementById('readySection');
  const loadingSection = document.getElementById('loadingSection');
  const resultsSection = document.getElementById('resultsSection');
  const errorSection = document.getElementById('errorSection');
  const errorMessage = document.getElementById('errorMessage');
  const retryBtn = document.getElementById('retryBtn');
  const rescanBtn = document.getElementById('rescanBtn');
  const copySummaryBtn = document.getElementById('copySummaryBtn');
  const copySummaryText = document.getElementById('copySummaryText');
  const deepReportLink = document.getElementById('deepReportLink');
  
  // Header / Settings Elements
  const statusPill = document.getElementById('backendStatusPill');
  const statusText = document.getElementById('statusText');
  const toggleSettingsBtn = document.getElementById('toggleSettingsBtn');
  const settingsPanel = document.getElementById('settingsPanel');
  const apiUrlInput = document.getElementById('apiUrlInput');
  const frontendUrlInput = document.getElementById('frontendUrlInput');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const testApiBtn = document.getElementById('testApiBtn');
  const settingsToast = document.getElementById('settingsToast');
  const navDashboardLink = document.getElementById('navDashboardLink');

  // Target info elements
  const targetDomain = document.getElementById('targetDomain');
  const targetFullUrl = document.getElementById('targetFullUrl');
  const protocolBadge = document.getElementById('protocolBadge');

  // Pipeline elements
  const pipelineStepText = document.getElementById('pipelineStepText');
  const pipelineStepPercent = document.getElementById('pipelineStepPercent');
  const pipelineBar = document.getElementById('pipelineBar');
  const stage1 = document.getElementById('stage1');
  const stage2 = document.getElementById('stage2');
  const stage3 = document.getElementById('stage3');
  const stage4 = document.getElementById('stage4');

  // Results elements
  const verdictBanner = document.getElementById('verdictBanner');
  const verdictIcon = document.getElementById('verdictIcon');
  const verdictTitle = document.getElementById('verdictTitle');
  const verdictProb = document.getElementById('verdictProb');
  const verdictDesc = document.getElementById('verdictDesc');

  let config = await getConfig();
  let currentScanData = null;
  let activeTab = null;

  // Sync inputs
  apiUrlInput.value = config.apiUrl;
  frontendUrlInput.value = config.frontendUrl;
  navDashboardLink.href = config.frontendUrl;

  // Check Backend Health
  async function checkBackendHealth() {
    statusPill.className = 'status-pill checking';
    statusText.textContent = 'Checking';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${config.apiUrl}/health`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        statusPill.className = 'status-pill online';
        statusText.textContent = 'API Online';
        statusPill.title = `Connected to ${config.apiUrl}`;
        return true;
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      statusPill.className = 'status-pill offline';
      statusText.textContent = 'API Offline';
      statusPill.title = `Cannot reach ${config.apiUrl}. Start backend with uvicorn.`;
      return false;
    }
  }

  // Initial health ping
  checkBackendHealth();

  // Settings Toggle
  toggleSettingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
    settingsToast.classList.add('hidden');
  });

  // Test Ping in Settings
  testApiBtn.addEventListener('click', async () => {
    testApiBtn.textContent = 'Testing...';
    testApiBtn.disabled = true;
    try {
      const url = apiUrlInput.value.trim().replace(/\/+$/, '');
      const res = await fetch(`${url}/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        showSettingsToast('API ping successful! Engine ready.', true);
      } else {
        showSettingsToast(`API responded with code ${res.status}`, false);
      }
    } catch (e) {
      showSettingsToast('Failed to reach API endpoint.', false);
    } finally {
      testApiBtn.textContent = 'Test Ping';
      testApiBtn.disabled = false;
    }
  });

  // Save Settings
  saveSettingsBtn.addEventListener('click', async () => {
    config = await saveConfig(apiUrlInput.value, frontendUrlInput.value);
    navDashboardLink.href = config.frontendUrl;
    showSettingsToast('Settings saved successfully!', true);
    checkBackendHealth();
    setTimeout(() => {
      settingsPanel.classList.add('hidden');
    }, 1200);
  });

  function showSettingsToast(msg, isSuccess) {
    settingsToast.textContent = msg;
    settingsToast.className = `settings-toast ${isSuccess ? 'success' : 'error'}`;
    settingsToast.classList.remove('hidden');
  }

  // 1. Detect Active Tab
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    activeTab = tab;

    if (!tab || !tab.url) {
      setUnsupportedState('No active webpage detected');
      return;
    }

    if (
      tab.url.startsWith('chrome://') || 
      tab.url.startsWith('chrome-extension://') || 
      tab.url.startsWith('edge://') || 
      tab.url.startsWith('about:')
    ) {
      setUnsupportedState('Internal browser page cannot be scanned');
      return;
    }

    // Parse URL & Protocol
    try {
      const parsedUrl = new URL(tab.url);
      targetDomain.textContent = parsedUrl.hostname;
      targetFullUrl.textContent = tab.url;

      if (parsedUrl.protocol === 'https:') {
        protocolBadge.textContent = 'HTTPS';
        protocolBadge.className = 'protocol-badge secure';
      } else if (parsedUrl.protocol === 'http:') {
        protocolBadge.textContent = 'HTTP INSECURE';
        protocolBadge.className = 'protocol-badge insecure';
      } else {
        protocolBadge.textContent = parsedUrl.protocol.replace(':', '').toUpperCase();
        protocolBadge.className = 'protocol-badge special';
      }
    } catch (e) {
      targetDomain.textContent = tab.url;
      targetFullUrl.textContent = tab.url;
    }

  } catch (err) {
    setUnsupportedState('Could not access current tab');
  }

  function setUnsupportedState(message) {
    targetDomain.textContent = message;
    targetFullUrl.textContent = 'Navigate to any HTTP/HTTPS website to scan';
    protocolBadge.textContent = 'UNSUPPORTED';
    protocolBadge.className = 'protocol-badge special';
    scanBtn.disabled = true;
  }

  // Progress Pipeline Helper
  function updatePipeline(stepName, percent, currentStage) {
    pipelineStepText.textContent = stepName;
    pipelineStepPercent.textContent = `${percent}%`;
    pipelineBar.style.width = `${percent}%`;

    const stages = [stage1, stage2, stage3, stage4];
    stages.forEach((el, idx) => {
      if (idx < currentStage - 1) {
        el.className = 'stage done';
      } else if (idx === currentStage - 1) {
        el.className = 'stage active';
      } else {
        el.className = 'stage';
      }
    });
  }

  // Scanning Execution
  async function executeScan() {
    if (!activeTab || !activeTab.id) return;

    readySection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');

    try {
      // Step 1: Extract DOM
      updatePipeline('Extracting DOM hierarchy & scripts...', 20, 1);
      
      let html = '';
      try {
        const injection = await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: () => document.documentElement.outerHTML
        });
        if (injection && injection[0] && injection[0].result) {
          html = injection[0].result.slice(0, 800000);
        }
      } catch (scriptErr) {
        console.warn('Script injection restricted, proceeding with empty html fallback:', scriptErr);
      }

      // Step 2: Capture Viewport Screenshot
      updatePipeline('Capturing viewport screenshot...', 45, 2);
      let screenshotBlob = null;
      try {
        const screenshotDataUrl = await chrome.tabs.captureVisibleTab(activeTab.windowId, { format: 'png' });
        const resBlob = await fetch(screenshotDataUrl);
        screenshotBlob = await resBlob.blob();
      } catch (visErr) {
        console.warn('Screenshot capture fallback:', visErr);
      }

      // Step 3: Neural Feature Extraction & Request
      updatePipeline('Extracting multi-modal neural features...', 70, 3);
      
      const formData = new FormData();
      formData.append('url', activeTab.url);
      formData.append('html', html || '<html><body></body></html>');
      formData.append('allow_fetch', 'false');
      if (screenshotBlob) {
        formData.append('screenshot', screenshotBlob, 'screenshot.png');
      }

      // Step 4: Ensemble Fusion Inference
      updatePipeline('Computing multimodal ensemble verdict...', 90, 4);

      const response = await fetch(`${config.apiUrl}/predict`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Inference engine error (${response.status}): ${errText.slice(0, 150)}`);
      }

      const data = await response.json();
      currentScanData = data;

      // Finish Pipeline
      updatePipeline('Analysis complete!', 100, 4);
      setTimeout(() => {
        displayResults(data);
      }, 350);

    } catch (err) {
      console.error('Scan failure:', err);
      loadingSection.classList.add('hidden');
      errorMessage.textContent = err.message || 'Failed to inspect page due to network or backend failure.';
      errorSection.classList.remove('hidden');
    }
  }

  // Display Results
  function displayResults(data) {
    loadingSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');

    const prob = (data.phishing_probability !== undefined && data.phishing_probability !== null)
      ? data.phishing_probability
      : 0;
    const probPercent = (prob * 100).toFixed(1);
    const label = (data.predicted_label || 'legitimate').toLowerCase();

    verdictProb.textContent = `${probPercent}%`;

    // Verdict themes & SVG icons
    if (label === 'phishing' || prob >= 0.7) {
      verdictBanner.className = 'verdict-banner phishing';
      verdictTitle.textContent = 'MALICIOUS / PHISHING';
      verdictDesc.textContent = 'High probability of credential theft, spoofed UI, or deceptive signals detected!';
      verdictIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" class="svg-icon-lg">
          <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    } else if (prob >= 0.4 || label === 'suspicious') {
      verdictBanner.className = 'verdict-banner suspicious';
      verdictTitle.textContent = 'SUSPICIOUS / ANOMALY';
      verdictDesc.textContent = 'Elevated risk parameters detected. Review inputs and SSL certificates before proceeding.';
      verdictIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" class="svg-icon-lg">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2"/>
          <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
    } else {
      verdictBanner.className = 'verdict-banner legitimate';
      verdictTitle.textContent = 'SAFE / LEGITIMATE';
      verdictDesc.textContent = 'Multimodal models confirmed legitimate domain reputation, clean DOM, and authentic UI visual layout.';
      verdictIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" class="svg-icon-lg">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    }

    // Per-Modality Updates
    const scores = data.per_modality_scores || {};
    renderModalityCard('Url', scores.url, 'Safe Syntax', 'Malicious Lexical');
    renderModalityCard('Html', scores.html, 'Clean DOM', 'Deceptive Forms');
    renderModalityCard('Text', scores.text, 'Neutral NLP', 'Urgent Lure');
    renderModalityCard('Vision', scores.vision, 'Original Layout', 'Spoofed Clone');

    // Deep Report Link
    if (data.scan_id) {
      deepReportLink.href = `${config.frontendUrl}/scan/${data.scan_id}`;
      deepReportLink.classList.remove('hidden');
    } else {
      deepReportLink.href = `${config.frontendUrl}`;
    }
  }

  function renderModalityCard(key, scoreVal, safeLabel, dangerLabel) {
    const scoreEl = document.getElementById(`score${key}`);
    const barEl = document.getElementById(`bar${key}`);
    const statusEl = document.getElementById(`status${key}`);

    if (scoreVal === null || scoreVal === undefined || isNaN(scoreVal)) {
      scoreEl.textContent = 'N/A';
      scoreEl.style.color = '#64748b';
      barEl.style.width = '0%';
      statusEl.textContent = 'Bypassed';
      statusEl.className = 'card-status warn';
      return;
    }

    const pct = Math.max(0, Math.min(100, scoreVal * 100));
    scoreEl.textContent = `${pct.toFixed(1)}%`;
    barEl.style.width = `${pct}%`;

    if (scoreVal >= 0.5) {
      barEl.style.backgroundColor = '#ef4444';
      scoreEl.style.color = '#ef4444';
      statusEl.textContent = dangerLabel;
      statusEl.className = 'card-status danger';
    } else if (scoreVal >= 0.3) {
      barEl.style.backgroundColor = '#f59e0b';
      scoreEl.style.color = '#f59e0b';
      statusEl.textContent = 'Minor Flag';
      statusEl.className = 'card-status warn';
    } else {
      barEl.style.backgroundColor = '#2bb673';
      scoreEl.style.color = '#2bb673';
      statusEl.textContent = safeLabel;
      statusEl.className = 'card-status safe';
    }
  }

  // Event Listeners
  scanBtn.addEventListener('click', executeScan);
  retryBtn.addEventListener('click', executeScan);
  
  rescanBtn.addEventListener('click', () => {
    resultsSection.classList.add('hidden');
    readySection.classList.remove('hidden');
  });

  // Copy Summary
  copySummaryBtn.addEventListener('click', () => {
    if (!currentScanData) return;
    const prob = (currentScanData.phishing_probability * 100).toFixed(1);
    const text = `[Phish360 Scan Report]\nTarget: ${activeTab?.url}\nVerdict: ${currentScanData.predicted_label.toUpperCase()} (${prob}% phish risk)\nURL Score: ${(currentScanData.per_modality_scores?.url * 100 || 0).toFixed(1)}%\nDOM Score: ${(currentScanData.per_modality_scores?.html * 100 || 0).toFixed(1)}%\nText Score: ${(currentScanData.per_modality_scores?.text * 100 || 0).toFixed(1)}%\nVision Score: ${(currentScanData.per_modality_scores?.vision * 100 || 0).toFixed(1)}%\nScan ID: ${currentScanData.scan_id || 'N/A'}`;

    navigator.clipboard.writeText(text).then(() => {
      copySummaryText.textContent = 'Copied!';
      setTimeout(() => {
        copySummaryText.textContent = 'Copy Summary';
      }, 1800);
    }).catch(err => {
      console.warn('Clipboard write error', err);
    });
  });
});
