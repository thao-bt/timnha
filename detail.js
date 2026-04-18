document.addEventListener('DOMContentLoaded', () => {
  const [checkin, checkout, guests, form, success] = ['booking-checkin-input', 'booking-checkout-input', 'booking-guests-input', 'booking-form', 'booking-success-message'].map(id => document.getElementById(id));
  let msgTimer = null;

  const toISODate = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const sanitizeGuests = v => {
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) && n > 0 ? String(n) : '1';
  };
  const syncDates = (start, end) => {
    if (start && end) {
      end.min = start.value;
      if (end.value < start.value) end.value = start.value;
    }
  };

  if (checkin && checkout && guests) {
    const today = new Date(), tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (!checkin.value) checkin.value = toISODate(today);
    if (!checkout.value) checkout.value = toISODate(tomorrow);
    syncDates(checkin, checkout);
    guests.value = sanitizeGuests(guests.value);
    const sync = () => { syncDates(checkin, checkout); guests.value = sanitizeGuests(guests.value); };
    checkin.addEventListener('change', sync);
    checkout.addEventListener('change', sync);
    guests.addEventListener('input', sync);
  }

  if (form && success) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      success.textContent = 'Bạn đã đặt phòng thành công';
      success.classList.add('is-visible');
      clearTimeout(msgTimer);
      msgTimer = setTimeout(() => success.classList.remove('is-visible'), 4000);
    });
  }

  const setupModal = (openSel, closeId, modalId) => {
    const open = typeof openSel === 'string' ? document.querySelector(openSel) : document.getElementById(openSel);
    const close = document.getElementById(closeId);
    const modal = document.getElementById(modalId);
    if (open && modal) {
      open.addEventListener('click', () => { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; });
      close.addEventListener('click', () => { modal.style.display = 'none'; document.body.style.overflow = 'auto'; });
    }
  };
  setupModal('openDescription', 'closeDescription', 'descriptionModal');
  setupModal('.show-all-amenities', 'closeAmenities', 'amenitiesModal');

  const normalizeMapLink = link => {
    const v = String(link || '').trim();
    return v && !/^https?:\/\//i.test(v) ? `https://${v}` : v;
  };
  const getSelectedId = () => {
    const id = new URLSearchParams(window.location.search).get('id');
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : null;
  };


  const renderAmenities = place => {
    const grid = document.querySelector('.amenities-grid');
    const btn = document.querySelector('.show-all-amenities');
    const modal = document.querySelector('#amenitiesModal .modal-body');
    const amenities = String(place.amenity || '').split(',').map(s => s.trim()).filter(Boolean);

    if (!amenities.length || !grid) return;
    grid.innerHTML = '';
    amenities.slice(0, 8).forEach(a => {
      const item = document.createElement('div');
      item.className = 'amenity-item';
      item.innerHTML = `<span aria-hidden="true">•</span><span>${a}</span>`;
      grid.appendChild(item);
    });

    if (btn) btn.textContent = `Hiển thị tất cả ${amenities.length} tiện nghi`;
    if (modal) {
      modal.innerHTML = `<h2 class="modal-title">Nơi này có những gì cho bạn</h2><div class="amenity-group"><h3>Tiện nghi</h3>${amenities.map(a => `<div class="amenity-list-item">${a}</div>`).join('')}</div>`;
    }
  };

  const renderPlace = place => {
    const sel = s => document.querySelector(s);
    const img = n => encodeURI(`image/Dữ Liệu Khách Sạn/${place.folder}/Ảnh/${n}`);

    const setContent = (s, v) => { const el = sel(s); if (el) el.textContent = v; };
    setContent('.title-section h1', String(place.name || '').trim());
    setContent('.info-column h2', String(place.destination || '').trim() ? `Phòng tại ${place.destination}` : '');
    setContent('.info-column .subtitle', String(place.bed || '').trim() ? `${place.bed} · Phòng tắm khép kín` : '');

    const desc = `${place.name}${place.amenity ? ' có đầy đủ tiện nghi cho kỳ nghỉ thoải mái. Tiện nghi nổi bật: ' + place.amenity : ''}`;
    setContent('.description-content', desc);
    setContent('#descriptionModal .modal-body p', desc);
    setContent('.location-address', place.destination || '');

    const big = sel('.big-photo img');
    if (big) {
      big.src = img(place.image);
      big.alt = place.name;
      big.loading = 'eager';
      big.onerror = () => big.src = 'image/nav-logo.png';
    }

    document.querySelectorAll('.small-photos img').forEach((el, i) => {
      el.src = img(place[`image_${i + 1}`] || place.image);
      el.alt = `${place.name} ${i + 1}`;
      el.loading = 'lazy';
      el.onerror = () => el.src = 'image/nav-logo.png';
    });

    const price = String(place.price || '').trim();
    setContent('.booking-card .current-price', price);

    const oldPrice = sel('.booking-card .old-price');
    if (oldPrice && price) {
      const num = Number(price.replace(/[^\d]/g, ''));
      if (Number.isFinite(num) && num > 0) {
        oldPrice.textContent = `₫${Math.round(num * 1.09).toLocaleString('vi-VN')}`;
      }
    }

    const mapFrame = sel('.map-embed-wrapper iframe');
    if (mapFrame) {
      const q = `${place.name} ${place.destination}`.trim();
      mapFrame.src = q ? `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed` : '';
    }

    const mapLink = sel('.location-footer');
    if (mapLink && place.map_link) {
      const url = normalizeMapLink(place.map_link);
      if (url) mapLink.innerHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">Xem vị trí trên Google Maps</a>`;
    }

    renderAmenities(place);
    document.title = (place.name || 'Timnha') + ' | Timnha';
  };


  const renderError = msg => { const el = document.querySelector('.title-section h1'); if (el) el.textContent = msg; };

  fetch('place.json')
    .then(r => r.ok ? r.json() : Promise.reject(`${r.status}`))
    .then(places => {
      const id = getSelectedId();
      const place = places.find(p => Number(p.id) === id) || places[0];
      renderPlace(place);
    })
    .catch(e => {
      console.error(e);
      renderError('Không thể tải dữ liệu chi tiết.');
    });
});
