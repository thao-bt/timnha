document.addEventListener('DOMContentLoaded', () => {
  const bars = document.querySelector('.hamburger-btn');
  const mobileMenuFixed = document.querySelector('.mobile-menu-fixed');
  const menu = document.querySelector('.mobile-menu-container');
  const destinationList = document.querySelector('#destination-list');

  const imageBase = 'image/Dữ Liệu Khách Sạn/Vinpearl BeachFront Nha Trang/Ảnh';

  if (bars && mobileMenuFixed && menu) {
    const closeMenu = () => {
      mobileMenuFixed.classList.remove('is-open');
    };

    bars.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      mobileMenuFixed.classList.toggle('is-open');
    });

    menu.addEventListener('click', (event) => {
      const link = event.target.closest('.mobile-menu-link');
      if (link) {
        closeMenu();
      }
    });

    mobileMenuFixed.addEventListener('click', (event) => {
      if (!menu.contains(event.target)) {
        closeMenu();
      }
    });
  }

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

  if (!destinationList) {
    return;
  }

  const normalizeDestination = (destination) => {
    const value = String(destination || '').trim();

    if (/^(tp\.?\s*)?hồ chí minh$/i.test(value) || /^hcm$/i.test(value)) {
      return 'TP. Hồ Chí Minh';
    }

    if (/^(tp\.?\s*)?hà nội$/i.test(value) || /^hn$/i.test(value)) {
      return 'Hà Nội';
    }

    return value;
  };

  const formatPrice = (price) => String(price || '').trim();

  const getImageUrl = (imageName) => {
    const fileName = String(imageName || '').trim();

    if (!fileName) {
      return 'image/nav-logo.png';
    }

    return encodeURI(`${imageBase}/${fileName}.png`);
  };

  const createCard = (place) => {
    const card = document.createElement('article');
    card.className = 'destination-card';

    const cardLink = document.createElement('a');
    cardLink.className = 'destination-card-link';
    cardLink.href = `detail.html?id=${encodeURIComponent(place.id)}`;
    cardLink.setAttribute('aria-label', `Xem chi tiết ${place.name || 'địa điểm'}`);

    const imageContainer = document.createElement('div');
    imageContainer.className = 'destination-image-container';

    const image = document.createElement('img');
    image.className = 'destination-img';
    image.src = getImageUrl(place.image);
    image.alt = place.name || 'Place image';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => {
      image.src = 'image/nav-logo.png';
    });

    const favoriteTag = document.createElement('p');
    favoriteTag.className = 'guest-favorite';
    favoriteTag.textContent = 'Được khách yêu thích';

    const favoriteIcon = document.createElement('i');
    favoriteIcon.className = 'fa-regular fa-heart fa-lg';
    favoriteIcon.style.color = 'rgb(9, 9, 9)';

    imageContainer.append(image, favoriteTag, favoriteIcon);

    const textContainer = document.createElement('div');
    textContainer.className = 'destination-text-container';

    const title = document.createElement('h4');
    title.className = 'destination-text-header';
    title.textContent = place.name || 'Unknown place';

    const price = document.createElement('p');
    price.className = 'destination-card-meta destination-price';
    price.textContent = `${formatPrice(place.price)} cho 2 đêm`;

    textContainer.append(title, price);
    cardLink.append(imageContainer, textContainer);
    card.append(cardLink);

    return card;
  };

  const createGroup = (destination, places) => {
    const group = document.createElement('div');
    group.className = 'destination-row';

    const headingRow = document.createElement('div');
    headingRow.className = 'destination-heading-row';

    const heading = document.createElement('h2');
    heading.className = 'destination-heading';
    heading.textContent = `Nơi lưu trú được ưa chuộng tại ${destination}`;

    const headingLink = document.createElement('span');
    headingLink.className = 'destination-heading-link';

    const headingIcon = document.createElement('i');
    headingIcon.className = 'fa-solid fa-chevron-right fa-xs';
    headingIcon.style.color = 'rgb(9, 9, 9)';

    headingLink.appendChild(headingIcon);
    headingRow.append(heading, headingLink);

    const grid = document.createElement('div');
    grid.className = 'destination-grid-container';

    const cards = [];

    places.forEach((place) => {
      const card = createCard(place);
      cards.push(card);
      grid.appendChild(card);
    });

    const loopCardCount = Math.min(6, cards.length);

    for (let index = 0; index < loopCardCount; index += 1) {
      const clonedCard = cards[index].cloneNode(true);
      clonedCard.classList.add('destination-card-clone');
      clonedCard.setAttribute('aria-hidden', 'true');
      grid.appendChild(clonedCard);
    }

    group.append(headingRow, grid);
    return group;
  };

  const renderPlaces = (places) => {
    const groupedPlaces = new Map();

    places.forEach((place) => {
      const destination = normalizeDestination(place.destination);

      if (!groupedPlaces.has(destination)) {
        groupedPlaces.set(destination, []);
      }

      groupedPlaces.get(destination).push(place);
    });

    destinationList.innerHTML = '';

    groupedPlaces.forEach((groupPlaces, destination) => {
      destinationList.appendChild(createGroup(destination, groupPlaces));
    });
  };

  const renderError = (message) => {
    destinationList.innerHTML = '';

    const errorState = document.createElement('p');
    errorState.textContent = message;
    destinationList.appendChild(errorState);
  };

  fetch('place.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load place.json (${response.status})`);
      }

      return response.json();
    })
    .then((places) => {
      if (!Array.isArray(places)) {
        throw new Error('place.json must contain an array of places.');
      }

      renderPlaces(places);
    })
    .catch((error) => {
      console.error(error);
      renderError('Không thể tải dữ liệu địa điểm từ place.json.');
    });
});