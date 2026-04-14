document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('profileMenuBtn');
    const dropdown = document.getElementById('dropdownMenu');

    if (menuBtn && dropdown) {
        // 1. Khi nhấn vào nút profile, bật/tắt menu
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Ngăn sự kiện lan ra ngoài để không bị đóng ngay lập tức
            dropdown.classList.toggle('show');
        });

        // 2. Khi nhấn bất kỳ đâu ngoài menu, menu sẽ tự đóng
        document.addEventListener('click', (e) => {
            // Nếu click không nằm trong dropdown và cũng không nằm trên nút menu
            if (!dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }
});

// Lấy các phần tử
const openBtn = document.getElementById('openDescription');
const closeBtn = document.getElementById('closeDescription');
const modal = document.getElementById('descriptionModal');

// Mở modal
openBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Ngăn cuộn trang web khi đang mở modal
});

// Đóng modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Cho phép cuộn lại
});

// Đóng khi nhấn ra ngoài vùng trắng
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Thêm vào sau đoạn code xử lý Modal Mô tả
const openAmenitiesBtn = document.querySelector('.show-all-amenities');
const closeAmenitiesBtn = document.getElementById('closeAmenities');
const amenitiesModal = document.getElementById('amenitiesModal');

if (openAmenitiesBtn && amenitiesModal) {
    // Mở modal tiện nghi
    openAmenitiesBtn.addEventListener('click', () => {
        amenitiesModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Khóa cuộn trang chính
    });

    // Đóng modal tiện nghi
    closeAmenitiesBtn.addEventListener('click', () => {
        amenitiesModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Đóng khi nhấn ra ngoài vùng Modal
    window.addEventListener('click', (e) => {
        if (e.target === amenitiesModal) {
            amenitiesModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}