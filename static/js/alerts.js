/* ═══════════════════════════════════════════════
   alerts.js — Real-time Agro Climatic Risk Engine
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // If we already have weatherData globally available from main.js/dashboard execution
    if (window.weatherData) {
        processAlerts(window.weatherData);
    } else {
        // Otherwise, request location to kick off the cycle
        initAlertsLocation();
    }
});

function initAlertsLocation() {
    const promptSection = document.getElementById('locationPromptSection');
    const alertSection = document.getElementById('alertsSection');

    if (promptSection) promptSection.style.display = 'block';
    if (alertSection) alertSection.style.display = 'none';

    const locBtn = document.getElementById('alertLocationBtn') || document.getElementById('locationBtn');
    if (locBtn) {
        locBtn.addEventListener('click', () => {
            // Use the shared geolocation helper from main.js
            if (typeof window.requestLocation === 'function') {
                window.requestLocation(async(lat, lon) => {
                    if (promptSection) promptSection.style.display = 'none';
                    if (alertSection) alertSection.style.display = 'block';

                    showAlertsLoading(true);
                    const weather = await fetchWeather(lat, lon);
                    if (weather) {
                        processAlerts(weather);
                    } else {
                        showAlertsLoading(false);
                    }
                });
            }
        });
    }
}

async function processAlerts(weather) {
    try {
        const response = await fetch('/api/alerts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                temp: weather.current.temp,
                humidity: weather.current.humidity,
                wind_speed: weather.current.wind_speed,
                rain: weather.current.rain || 0,
                description: weather.current.description
            })
        });

        if (!response.ok) throw new Error('Alerts server error');
        const data = await response.json();

        // Save alert count to session storage and update navbar badge as per main.js design
        sessionStorage.setItem('alert_count', data.total);
        if (typeof updateAlertBadge === 'function') {
            updateAlertBadge(data.total);
        }

        renderSummaryCounters(data.alerts);
        renderAlertCards(data.alerts);
        setupFilterListeners(data.alerts);

    } catch (err) {
        console.error('Error fetching alerts:', err);
        showToast('Failed to compile environmental risk analysis.', 'error');
    } finally {
        showAlertsLoading(false);
    }
}

function showAlertsLoading(isLoading) {
    const loader = document.getElementById('alertsLoading');
    if (loader) loader.style.display = isLoading ? 'block' : 'none';
}

function renderSummaryCounters(alerts) {
    const dangerCount = alerts.filter(a => a.type === 'danger').length;
    const warningCount = alerts.filter(a => a.type === 'warning').length;
    const infoCount = alerts.filter(a => a.type === 'info').length;

    // Direct binding to the CSS layout items using animateCounter helper from main.js
    if (typeof animateCounter === 'function') {
        animateCounter(document.getElementById('dangerCount'), dangerCount);
        animateCounter(document.getElementById('warningCount'), warningCount);
        animateCounter(document.getElementById('infoCount'), infoCount);
        animateCounter(document.getElementById('totalCount'), alerts.length);
    } else {
        document.getElementById('dangerCount').textContent = dangerCount;
        document.getElementById('warningCount').textContent = warningCount;
        document.getElementById('infoCount').textContent = infoCount;
        document.getElementById('totalCount').textContent = alerts.length;
    }
}

function renderAlertCards(alerts, filterType = 'all') {
    const listContainer = document.getElementById('alertsList');
    const noAlertsContainer = document.getElementById('noAlerts');
    if (!listContainer) return;

    const filtered = filterType === 'all' ? alerts : alerts.filter(a => a.type === filterType);

    if (filtered.length === 0) {
        listContainer.innerHTML = '';
        if (noAlertsContainer) noAlertsContainer.style.display = 'block';
        return;
    }

    if (noAlertsContainer) noAlertsContainer.style.display = 'none';

    listContainer.innerHTML = filtered.map((alert, index) => `
        <div class="alert-card ${alert.type}" style="animation-delay: ${index * 0.05}s">
            <div class="alert-card-icon">${alert.icon}</div>
            <div class="alert-card-body">
                <div class="alert-card-top">
                    <span class="alert-card-title">${alert.title}</span>
                    <span class="alert-category cat-${alert.category.toLowerCase()}">${alert.category}</span>
                </div>
                <div class="alert-card-msg">${alert.message}</div>
                <div class="alert-card-action">
                    <i class="fas fa-shield-halved"></i>
                    <span><strong>Action Required:</strong> ${alert.action}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Trigger Intersection Observer for staggering fade effects
    if (typeof observeAnimations === 'function') {
        observeAnimations();
    }
}

function setupFilterListeners(alerts) {
    const tabs = document.querySelectorAll('.alert-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');

            const filter = e.currentTarget.getAttribute('data-filter');
            renderAlertCards(alerts, filter);
        });
    });
}