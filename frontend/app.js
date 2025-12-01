const API_BASE = 'http://localhost:4000';

function badgeClassFromStatus(status) {
  switch ((status || '').toLowerCase()) {
    case 'running':
    case 'ok':
      return 'status-badge status-ok';
    case 'degraded':
    case 'warn':
      return 'status-badge status-warn';
    case 'down':
    case 'error':
    default:
      return 'status-badge status-down';
  }
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

async function refreshDashboard() {
  const servicesBody = document.getElementById('services-body');
  const svcCount = document.getElementById('svc-count');
  const svcChip = document.getElementById('svc-chip');
  const apiStatusLabel = document.getElementById('api-status-label');
  const apiStatusChip = document.getElementById('api-status-chip');
  const healthTime = document.getElementById('health-time');

  servicesBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:12px 0; color:#9ca3af;">Updating...</td></tr>';
  apiStatusChip.textContent = 'Checking /health...';

  try {
    const [health, servicesRes] = await Promise.all([
      fetchJson(`${API_BASE}/health`),
      fetchJson(`${API_BASE}/services`)
    ]);

    apiStatusLabel.textContent = (health.status || 'unknown').toUpperCase();
    apiStatusChip.textContent = `Uptime: ${health.uptime.toFixed(0)}s`;
    healthTime.textContent = new Date(health.timestamp).toLocaleString();

    const services = servicesRes.services || [];
    svcCount.textContent = services.length.toString();
    svcChip.textContent = services.length
      ? `${services.filter(s => (s.status || '').toLowerCase() === 'running').length} running`
      : 'No services';

    if (!services.length) {
      servicesBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:12px 0; color:#9ca3af;">No services returned from API.</td></tr>';
      return;
    }

    servicesBody.innerHTML = services.map(s => {
      const badgeClass = badgeClassFromStatus(s.status);
      const port = s.port ? `:${s.port}` : '-';
      const desc = s.description || '';
      return `
        <tr>
          <td>
            <div style="font-weight:500;">${s.name}</div>
            <div style="font-size:11px; color:#9ca3af;">${s.key || ''}</div>
          </td>
          <td>
            <span class="${badgeClass}">
              <span class="dot"></span>
              ${String(s.status || 'unknown').toUpperCase()}
            </span>
          </td>
          <td><span class="tag">localhost${port}</span></td>
          <td>${desc}</td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    console.error(err);
    servicesBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:12px 0; color:#fca5a5;">Failed to load from API: ${err.message}</td></tr>`;
    apiStatusLabel.textContent = 'ERROR';
    apiStatusChip.textContent = 'Cannot reach API /health';
    healthTime.textContent = '—';
    svcChip.textContent = 'Error';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('refresh-btn');
  btn.addEventListener('click', () => refreshDashboard());
  refreshDashboard();
});
