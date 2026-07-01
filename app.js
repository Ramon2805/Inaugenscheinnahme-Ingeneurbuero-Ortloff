const storageKey = 'inaugenscheinnahme-punkte';

const defaultPoints = [
  'Zugänge zum Fahrschacht, zum Triebwerksraum und den dazugehörigen Schalteinrichtungen sind frei und sicher begehbar, Beleuchtung funktioniert.',
  'Zugang zu den Aufzugstüren ist sicher begehbar, Beleuchtung funktioniert.',
  'Keine aufzugsfremden Gegenstände sind im Triebwerksraum, in anderen aufzugszugehörigen Bereichen.',
  'Alle aufzugszugehörigen Räume und Bereiche werden unter Verschluss gehalten und können nur von Befugten betreten werden.',
  'Der Fahrkorb kann nicht anfahren, solange eine Schachttür geöffnet ist.',
  'Eine Schachttür lässt sich nicht öffnen, solange sich der Fahrkorb außerhalb der Entriegelungszone dieser Tür befindet.',
  'Der Fahrkorb kann nicht anfahren, solange die Fahrkorbtür geöffnet ist.',
  'Der Fahrkorb fährt die einzelnen Haltestellen bodenbündig an.',
  'Die Notrufeinrichtung funktioniert und bei Anlagen mit Fernnotruf ist die Verständigung mit der Leitzentrale möglich.',
  'Der Notbremsschalter bzw. der TÜR-AUF-Taster ist wirksam.',
  'Die Fahrkorbbeleuchtung funktioniert.',
  'Fahrkorbtüren, -wände und Schachttüren sind mechanisch in Ordnung.',
  'Hinweise auf die beauftragte Person (Aufzugswärter) an der Hauptzugangsstelle (z. B. im Erdgeschoss) sind lesbar und aktuell.',
  'Sicherheitskennzeichnungen und Piktogramme sind vorhanden und lesbar. Anzeigen, die sich in einem allgemein zugänglichen Bereich befinden, sind funktionstüchtig.',
  'Sonstiges'
];

const checklist = document.getElementById('checklist');
const splashScreen = document.getElementById('splash-screen');
const logos = document.querySelectorAll('.company-logo');
const reportBtn = document.getElementById('report-btn');
const releaseBtn = document.getElementById('release-btn');
const releaseStatus = document.getElementById('release-status');
const releaseChecked = document.getElementById('release-checked');
const signatureField = document.getElementById('signature-field');
const reportDate = document.getElementById('report-date');
const installationLocation = document.getElementById('installation-location');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizePoint(point, index) {
  if (typeof point === 'string') {
    return { id: `punkt-${index + 1}`, text: point, status: 'pending', note: '', photo: '' };
  }

  return {
    id: point.id || `punkt-${index + 1}`,
    text: point.text || '',
    status: point.status || (typeof point.checked === 'boolean' ? (point.checked ? 'io' : 'pending') : 'pending'),
    note: point.note || '',
    photo: point.photo || ''
  };
}

function loadPoints() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    return defaultPoints.map((text, index) => normalizePoint(text, index));
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.map((point, index) => normalizePoint(point, index)) : defaultPoints.map((text, index) => normalizePoint(text, index));
  } catch {
    return defaultPoints.map((text, index) => normalizePoint(text, index));
  }
}

function savePoints(points) {
  localStorage.setItem(storageKey, JSON.stringify(points));
}

function updateReleaseState(points) {
  const allDone = points.every((item) => item.status === 'io' || item.status === 'mangel');
  const allReviewed = points.every((item) => item.status === 'io' || item.status === 'mangel');
  const signaturePresent = (signatureField?.value || '').trim().length > 0;
  const canRelease = allDone && allReviewed && signaturePresent && releaseChecked?.checked;

  if (releaseStatus) {
    releaseStatus.textContent = canRelease
      ? 'Freigabe bereit.'
      : 'Bitte alle Punkte bearbeiten und Unterschrift ergänzen.';
  }

  if (releaseBtn) {
    releaseBtn.disabled = !canRelease;
    releaseBtn.style.opacity = canRelease ? '1' : '0.6';
  }
}

function renderPoints() {
  const points = loadPoints();
  updateReleaseState(points);
  checklist.innerHTML = '';

  points.forEach((point) => {
    const li = document.createElement('li');
    if (point.status === 'io') {
      li.classList.add('ok');
    } else if (point.status === 'mangel') {
      li.classList.add('not-ok');
    }

    li.innerHTML = `
      <div class="item-row">
        <span class="text-wrap">${escapeHtml(point.text)}</span>
        <div class="status-actions">
          <button class="status-btn ok ${point.status === 'io' ? 'active' : ''}" type="button" data-action="io">i.O.</button>
          <button class="status-btn not-ok ${point.status === 'mangel' ? 'active' : ''}" type="button" data-action="mangel">Mangel</button>
        </div>
      </div>
      ${point.status === 'mangel' ? `
        <label class="field-label">
          <span>Foto hinzufügen</span>
          <input class="photo-input" type="file" accept="image/*" />
        </label>
        <label class="field-label">
          <span>Bemerkung</span>
          <textarea class="problem-note" rows="2" placeholder="Problem kurz erläutern...">${escapeHtml(point.note)}</textarea>
        </label>
      ` : ''}
    `;

    li.querySelectorAll('.status-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const updated = loadPoints().map((item) => item.id === point.id ? { ...item, status: button.dataset.action } : item);
        savePoints(updated);
        renderPoints();
      });
    });

    const noteField = li.querySelector('.problem-note');
    if (noteField) {
      noteField.addEventListener('input', (event) => {
        const updated = loadPoints().map((item) => item.id === point.id ? { ...item, note: event.target.value } : item);
        savePoints(updated);
      });
    }

    const photoInput = li.querySelector('.photo-input');
    if (photoInput) {
      photoInput.addEventListener('change', (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const updated = loadPoints().map((item) => item.id === point.id ? { ...item, photo: reader.result } : item);
          savePoints(updated);
        };
        reader.readAsDataURL(file);
      });
    }

    checklist.appendChild(li);
  });
}

function showSplash() {
  if (!splashScreen) return;
  setTimeout(() => {
    splashScreen.classList.add('hidden');
    logos.forEach((logo) => logo.classList.add('is-visible'));
  }, 2400);
}

reportBtn?.addEventListener('click', () => {
  window.print();
});

releaseBtn?.addEventListener('click', () => {
  if (!releaseChecked?.checked) {
    releaseStatus.textContent = 'Bitte bestätigen Sie die Freigabe.';
    return;
  }
  const points = loadPoints();
  const ready = points.every((item) => item.status === 'io' || item.status === 'mangel');
  const signaturePresent = (signatureField?.value || '').trim().length > 0;
  if (ready && signaturePresent) {
    releaseStatus.textContent = 'Freigegeben.';
  } else {
    releaseStatus.textContent = 'Bitte alle Punkte bearbeiten und Unterschrift ergänzen.';
  }
});

[signatureField, releaseChecked, reportDate, installationLocation].forEach((element) => {
  element?.addEventListener('input', () => {
    const points = loadPoints();
    updateReleaseState(points);
  });
});

window.addEventListener('load', () => {
  logos.forEach((logo) => logo.classList.add('is-visible'));
  showSplash();
});

renderPoints();
