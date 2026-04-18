document.addEventListener('DOMContentLoaded', () => {
  const destinationList = document.querySelector('#destination-list');
  let allPlaces = [];

  const getImageUrl = (imageName, place) => {
    if (!imageName) return 'image/nav-logo.png';
    return encodeURI(`image/Dữ Liệu Khách Sạn/${place.folder}/Ảnh/${imageName}`);
  };

  // Create card element
  const createCard = place => {
    const card = document.createElement('article');
    card.className = 'destination-card';
    card.innerHTML = `
      <a href="detail.html?id=${place.id}" class="destination-card-link">
        <div class="destination-image-container">
          <img class="destination-img" src="${getImageUrl(place.image_1, place)}" alt="${place.name}" loading="lazy">
          <p class="guest-favorite"> Guest favourite</p>
        </div>
        <div class="destination-info">
          <h3 class="destination-name">${place.name}</h3>
          <p class="destination-description">${place.destination}</p>
          <p class="destination-price"><strong>${place.price}</strong>/đêm</p>
        </div>
      </a>
    `;
    return card;
  };

  // Handle auth links
  const authLinks = document.querySelectorAll('[data-auth-link]');
  const syncAuthLinks = () => {
    const isLoggedIn = !!localStorage.getItem('currentUser');
    authLinks.forEach(link => {
      link.textContent = isLoggedIn ? 'Đăng xuất' : 'Đăng nhập';
      link.href = isLoggedIn ? '#' : 'sign-up.html';
      link.onclick = isLoggedIn ? (e) => { e.preventDefault(); localStorage.removeItem('currentUser'); location.reload(); } : null;
    });
  };
  syncAuthLinks();

  const normalizeDestination = destination => {
    const value = String(destination || '').trim();
    if (/^(tp\.?\s*)?hồ chí minh$/i.test(value) || /^hcm$/i.test(value)) return 'TP. Hồ Chí Minh';
    if (/^(tp\.?\s*)?hà nội$/i.test(value) || /^hn$/i.test(value)) return 'Hà Nội';
    return value;
  };

  // Group places by destination
  const groupByDestination = places => {
    const grouped = new Map();
    places.forEach(p => {
      const dest = normalizeDestination(p.destination);
      if (!grouped.has(dest)) grouped.set(dest, []);
      grouped.get(dest).push(p);
    });
    return grouped;
  };

  // Filter places based on search criteria
  const filterPlaces = (places, searchName, maxPrice, maxGuests) => {
    return places.filter(place => {
      // Filter by name/destination
      if (searchName) {
        const name = String(place.name || '').toLowerCase();
        const dest = String(place.destination || '').toLowerCase();
        const search = String(searchName || '').toLowerCase();
        if (!name.includes(search) && !dest.includes(search)) return false;
      }

      // Filter by price (max price)
      if (maxPrice) {
        const placePrice = Number(String(place.price || '').replace(/[^\d]/g, ''));
        const userMaxPrice = Number(String(maxPrice).replace(/[^\d]/g, ''));
        if (Number.isFinite(placePrice) && Number.isFinite(userMaxPrice) && placePrice > userMaxPrice) return false;
      }

      // Filter by guests (bed * 2)
      if (maxGuests) {
        const bedStr = String(place.bed || '').trim();
        const bedCount = Number(bedStr.match(/\d+/)?.[0] || 1);
        const maxGuestsFromBeds = bedCount * 2;
        const userGuests = Number(maxGuests);
        if (Number.isFinite(userGuests) && maxGuestsFromBeds < userGuests) return false;
      }

      return true;
    });
  };

  // Render the grouped layout
  const renderPlaces = places => {
    if (!destinationList) return;
    destinationList.innerHTML = '';
    
    const grouped = groupByDestination(places);
    if (grouped.size === 0) {
      destinationList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">Không tìm thấy kết quả phù hợp</p>';
      return;
    }

    grouped.forEach((groupPlaces, destination) => {
      const section = document.createElement('div');
      section.className = 'destination-row';
      
      // Heading
      const headingRow = document.createElement('div');
      headingRow.className = 'destination-heading-row';
      headingRow.innerHTML = `
        <h2 class="destination-heading">Nơi lưu trú được ưa chuộng tại ${destination}</h2>
        <span class="destination-heading-link"><i class="fa-solid fa-chevron-right fa-xs"></i></span>
      `;
      
      // Grid
      const grid = document.createElement('div');
      grid.className = 'destination-grid-container';
      
      // First pass - add actual cards
      const cards = groupPlaces.map(p => {
        const card = document.createElement('article');
        card.className = 'destination-card';
        card.innerHTML = `
          <a href="detail.html?id=${p.id}" class="destination-card-link">
            <div class="destination-image-container">
              <img class="destination-img" src="${getImageUrl(p.image_1, p)}" alt="${p.name}" loading="lazy">
              <p class="guest-favorite"> Được khách yêu thích</p>
            </div>
            <div class="destination-text-container">
              <h4 class="destination-text-header">${p.name}</h4>
              <p class="destination-card-meta destination-price">${p.price} cho 2 đêm</p>
            </div>
          </a>
        `;
        grid.appendChild(card);
        return card;
      });
      
      // Second pass - add cloned cards for carousel effect
      cards.slice(0, 6).forEach(card => {
        const cloned = card.cloneNode(true);
        cloned.classList.add('destination-card-clone');
        cloned.setAttribute('aria-hidden', 'true');
        grid.appendChild(cloned);
      });
      
      section.append(headingRow, grid);
      destinationList.appendChild(section);
    });
  };

  // Search and filter functionality
  const searchButton = document.querySelector('.header-search-button');
  const performSearch = () => {
    const headerSearchBar = document.querySelector('.header-search-bar');
    const inputs = headerSearchBar?.querySelectorAll('input');
    
    const searchName = inputs?.[0]?.value || '';
    const maxPrice = inputs?.[1]?.value || '';
    const maxGuests = inputs?.[2]?.value || '';

    const filtered = filterPlaces(allPlaces, searchName, maxPrice, maxGuests);
    renderPlaces(filtered);
  };

  if (searchButton) {
    searchButton.addEventListener('click', performSearch);
  }

  // Mobile search connector - sync to desktop and search
  const mobileSearchInput = document.querySelector('.mobile-sticky-menu-search .header-search-input');
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const desktopInput = document.querySelector('.header-search-bar .header-search-input');
        if (desktopInput) desktopInput.value = mobileSearchInput.value;
        performSearch();
      }
    });
  }

  // Fetch and render
  fetch('place.json')
    .then(r => {
      if (!r.ok) throw new Error(`Failed to load (${r.status})`);
      return r.json();
    })
    .then(places => {
      if (!Array.isArray(places)) throw new Error('Invalid data');
      allPlaces = places;
      renderPlaces(places);
    })
    .catch(e => {
      console.error(e);
      if (destinationList) destinationList.innerHTML = '<p>Không thể tải dữ liệu.</p>';
    });
});