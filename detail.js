document.addEventListener('DOMContentLoaded', () => {
  const imageBase = 'image/Dữ Liệu Khách Sạn/Vinpearl BeachFront Nha Trang/Ảnh';

  const bookingCheckinInput = document.getElementById('booking-checkin-input');
  const bookingCheckoutInput = document.getElementById('booking-checkout-input');
  const bookingGuestsInput = document.getElementById('booking-guests-input');

  const toISODate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const sanitizeGuestValue = (value) => {
    const guests = Number.parseInt(value, 10);
    return Number.isFinite(guests) && guests > 0 ? String(guests) : '1';
  };

  const enforceDateRange = (startInput, endInput) => {
    if (!startInput || !endInput) {
      return;
    }

    endInput.min = startInput.value;

    if (endInput.value < startInput.value) {
      endInput.value = startInput.value;
    }
  };

  const initializeDefaults = () => {
    const startInput = bookingCheckinInput;
    const endInput = bookingCheckoutInput;
    const guestsInput = bookingGuestsInput;

    if (!startInput || !endInput || !guestsInput) {
      return;
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (!startInput.value) {
      startInput.value = toISODate(today);
    }

    if (!endInput.value) {
      endInput.value = toISODate(tomorrow);
    }

    enforceDateRange(startInput, endInput);
    guestsInput.value = sanitizeGuestValue(guestsInput.value);
  };

  const syncBookingInputs = () => {
    if (!bookingCheckinInput || !bookingCheckoutInput || !bookingGuestsInput) {
      return;
    }

    enforceDateRange(bookingCheckinInput, bookingCheckoutInput);
    bookingGuestsInput.value = sanitizeGuestValue(bookingGuestsInput.value);
  };

  initializeDefaults();

  if (bookingCheckinInput && bookingCheckoutInput && bookingGuestsInput) {
    syncBookingInputs();

    bookingCheckinInput.addEventListener('change', syncBookingInputs);
    bookingCheckoutInput.addEventListener('change', syncBookingInputs);
    bookingGuestsInput.addEventListener('input', syncBookingInputs);
  }

  const getImageUrl = (imageName) => {
    const fileName = String(imageName || '').trim();

    if (!fileName) {
      return 'image/nav-logo.png';
    }

    return encodeURI(`${imageBase}/${fileName}.png`);
  };

      // 3. XỬ LÝ MODAL MÔ TẢ & TIỆN NGHI
    const openBtn = document.getElementById('openDescription');
    const closeBtn = document.getElementById('closeDescription');
    const modal = document.getElementById('descriptionModal');

    if (openBtn && modal) {
        openBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    const openAmenitiesBtn = document.querySelector('.show-all-amenities');
    const closeAmenitiesBtn = document.getElementById('closeAmenities');
    const amenitiesModal = document.getElementById('amenitiesModal');

    if (openAmenitiesBtn && amenitiesModal) {
        openAmenitiesBtn.addEventListener('click', () => {
            amenitiesModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        closeAmenitiesBtn.addEventListener('click', () => {
            amenitiesModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

  const normalizeMapLink = (mapLink) => {
    const value = String(mapLink || '').trim();

    if (!value) {
      return '';
    }

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    return `https://${value}`;
  };

  const getSelectedId = () => {
    const params = new URLSearchParams(window.location.search);
    const rawId = params.get('id');

    if (!rawId) {
      return null;
    }

    const parsed = Number(rawId);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const renderAmenities = (place) => {
    const amenitiesGrid = document.querySelector('.amenities-grid');
    const showAllAmenitiesBtn = document.querySelector('.show-all-amenities');
    const amenitiesModalBody = document.querySelector('#amenitiesModal .modal-body');

    const amenities = String(place.amenity || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (!amenities.length || !amenitiesGrid) {
      return;
    }

    amenitiesGrid.innerHTML = '';

    amenities.slice(0, 8).forEach((amenity) => {
      const amenityItem = document.createElement('div');
      amenityItem.className = 'amenity-item';

      const icon = document.createElement('span');
      icon.textContent = '•';
      icon.setAttribute('aria-hidden', 'true');

      const label = document.createElement('span');
      label.textContent = amenity;

      amenityItem.append(icon, label);
      amenitiesGrid.appendChild(amenityItem);
    });

    if (showAllAmenitiesBtn) {
      showAllAmenitiesBtn.textContent = `Hiển thị tất cả ${amenities.length} tiện nghi`;
    }

    if (amenitiesModalBody) {
      const modalTitle = amenitiesModalBody.querySelector('.modal-title');
      amenitiesModalBody.innerHTML = '';

      if (modalTitle) {
        amenitiesModalBody.appendChild(modalTitle);
      } else {
        const generatedTitle = document.createElement('h2');
        generatedTitle.className = 'modal-title';
        generatedTitle.textContent = 'Nơi này có những gì cho bạn';
        amenitiesModalBody.appendChild(generatedTitle);
      }

      const amenityGroup = document.createElement('div');
      amenityGroup.className = 'amenity-group';

      const groupTitle = document.createElement('h3');
      groupTitle.textContent = 'Tiện nghi';
      amenityGroup.appendChild(groupTitle);

      amenities.forEach((amenity) => {
        const amenityListItem = document.createElement('div');
        amenityListItem.className = 'amenity-list-item';
        amenityListItem.textContent = amenity;
        amenityGroup.appendChild(amenityListItem);
      });

      amenitiesModalBody.appendChild(amenityGroup);
    }
  };

  const renderPlace = (place) => {
    const title = document.querySelector('.title-section h1');
    const infoTitle = document.querySelector('.info-column h2');
    const subtitle = document.querySelector('.info-column .subtitle');
    const hostName = document.querySelector('.host-name b');
    const hostAvatar = document.querySelector('.host-avatar');
    const description = document.querySelector('.description-content');
    const modalDescription = document.querySelector('#descriptionModal .modal-body p');
    const locationAddress = document.querySelector('.location-address');
    const locationFooter = document.querySelector('.location-footer');
    const locationMapFrame = document.querySelector('.map-embed-wrapper iframe');
    const oldPriceText = document.querySelector('.booking-card .old-price');
    const currentPriceText = document.querySelector('.booking-card .current-price');

    const bigPhoto = document.querySelector('.big-photo img');
    const smallPhotos = document.querySelectorAll('.small-photos img');
    const imageUrl = getImageUrl(place.image);

    if (title) {
      title.textContent = String(place.name || '').trim();
    }

    if (infoTitle) {
      infoTitle.textContent = String(place.destination || '').trim()
        ? `Phòng tại ${String(place.destination).trim()}`
        : '';
    }

    if (subtitle) {
      const bedText = String(place.bed || '').trim().toLowerCase();
      subtitle.textContent = bedText ? `${bedText} · Phòng tắm khép kín` : '';
    }

    if (hostName) {
      const hostText = String(place.name || '').trim();
      hostName.textContent = hostText ? `Host: ${hostText}` : '';
    }

    if (hostAvatar) {
      hostAvatar.src = imageUrl;
      hostAvatar.alt = `Host avatar ${place.name || ''}`.trim();
      hostAvatar.addEventListener('error', () => {
        hostAvatar.src = 'image/nav-logo.png';
      });
    }

    const placeName = String(place.name || '').trim();
    const amenityText = String(place.amenity || '').trim();
    const generatedDescription = placeName && amenityText
      ? `${placeName} có đầy đủ tiện nghi cho kỳ nghỉ thoải mái. Tiện nghi nổi bật: ${amenityText}`
      : amenityText;

    if (description) {
      description.textContent = generatedDescription;
    }

    if (modalDescription) {
      modalDescription.textContent = generatedDescription;
    }

    if (bigPhoto) {
      bigPhoto.src = imageUrl;
      bigPhoto.alt = String(place.name || '').trim();
      bigPhoto.loading = 'eager';
      bigPhoto.addEventListener('error', () => {
        bigPhoto.src = 'image/nav-logo.png';
      });
    }

    smallPhotos.forEach((img, index) => {
      img.src = imageUrl;
      const baseAlt = String(place.name || '').trim();
      img.alt = baseAlt ? `${baseAlt} ${index + 1}` : '';
      img.loading = 'lazy';
      img.addEventListener('error', () => {
        img.src = 'image/nav-logo.png';
      });
    });

    if (currentPriceText) {
      currentPriceText.textContent = String(place.price || '').trim();
    }

    if (oldPriceText) {
      const numericPrice = Number(String(place.price || '').replace(/[^\d]/g, ''));

      if (Number.isFinite(numericPrice) && numericPrice > 0) {
        const estimatedOldPrice = Math.round(numericPrice * 1.09);
        oldPriceText.textContent = `₫${estimatedOldPrice.toLocaleString('vi-VN')}`;
      }
    }

    if (locationAddress) {
      locationAddress.textContent = String(place.destination || '').trim();
    }

    if (locationMapFrame) {
      const mapQuerySource = `${String(place.name || '').trim()} ${String(place.destination || '').trim()}`.trim();

      if (mapQuerySource) {
        const mapQuery = encodeURIComponent(mapQuerySource);
        locationMapFrame.src = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
      } else {
        locationMapFrame.src = '';
      }
    }

    const normalizedMapLink = normalizeMapLink(place.map_link);

    if (locationFooter && normalizedMapLink) {
      locationFooter.innerHTML = '';
      const mapAnchor = document.createElement('a');
      mapAnchor.href = normalizedMapLink;
      mapAnchor.target = '_blank';
      mapAnchor.rel = 'noopener noreferrer';
      mapAnchor.textContent = 'Xem vị trí trên Google Maps';
      locationFooter.appendChild(mapAnchor);
    }

    renderAmenities(place);
    document.title = String(place.name || '').trim()
      ? `${String(place.name).trim()} | Timnha`
      : 'Timnha';
  };

  const renderError = (message) => {
    const title = document.querySelector('.title-section h1');

    if (title) {
      title.textContent = message;
    }
  };

  fetch('place.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load place.json (${response.status})`);
      }

      return response.json();
    })
    .then((places) => {
      if (!Array.isArray(places) || !places.length) {
        throw new Error('place.json must contain a non-empty array of places.');
      }

      const selectedId = getSelectedId();
      const selectedPlace =
        places.find((place) => Number(place.id) === selectedId) || places[0];

      renderPlace(selectedPlace);
    })
    .catch((error) => {
      console.error(error);
      renderError('Không thể tải dữ liệu chi tiết từ place.json.');
    });
});
