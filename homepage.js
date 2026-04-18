document.addEventListener('DOMContentLoaded', () => {
  const destinationList = document.querySelector('#destination-list');

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

  // Fetch and render
  fetch('place.json')
    .then(r => r.json())
    .then(places => {
      if (destinationList) {
        destinationList.innerHTML = '';
        places.forEach(place => destinationList.appendChild(createCard(place)));
      }
    })
    .catch(e => console.error('Error loading places:', e));

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

  const mobileFooter = document.querySelector('.mobile-footer-container');

  if (mobileFooter) {
    let lastScrollY = window.scrollY;
    const scrollDeltaThreshold = 4;

    const toggleMobileFooterVisibility = () => {
      if (window.innerWidth > 917) {
        mobileFooter.classList.remove('is-visible');
        lastScrollY = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;
      const isAtTop = currentScrollY <= 8;
      const isScrollingDown = currentScrollY > lastScrollY + scrollDeltaThreshold;
      const isScrollingUp = currentScrollY < lastScrollY - scrollDeltaThreshold;

      if (isAtTop || isScrollingUp) {
        mobileFooter.classList.remove('is-visible');
      } else if (isScrollingDown) {
        mobileFooter.classList.add('is-visible');
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', toggleMobileFooterVisibility, { passive: true });
    window.addEventListener('resize', toggleMobileFooterVisibility);
    toggleMobileFooterVisibility();
  }

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

  // Render the grouped layout
  const renderPlaces = places => {
    if (!destinationList) return;
    destinationList.innerHTML = '';
    
    groupByDestination(places).forEach((groupPlaces, destination) => {
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

  // Fetch and render
  fetch('place.json')
    .then(r => {
      if (!r.ok) throw new Error(`Failed to load (${r.status})`);
      return r.json();
    })
    .then(places => {
      if (!Array.isArray(places)) throw new Error('Invalid data');
      renderPlaces(places);
    })
    .catch(e => {
      console.error(e);
      if (destinationList) destinationList.innerHTML = '<p>Không thể tải dữ liệu.</p>';
    });
});