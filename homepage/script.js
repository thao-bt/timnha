document.addEventListener('DOMContentLoaded', () => {
    // 1. XỬ LÝ MENU DROPDOWN (Profile)
    const menuBtn = document.getElementById('profileMenuBtn');
    const dropdown = document.getElementById('dropdownMenu');

    if (menuBtn && dropdown) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    // 2. XỬ LÝ HIỂN THỊ ĐĂNG NHẬP / ĐĂNG XUẤT
    const authBtnContainer = document.getElementById('auth-btn-container');
    const savedUser = localStorage.getItem('currentUser');

    if (savedUser && authBtnContainer) {
        const user = JSON.parse(savedUser);

        // Thay đổi giao diện bên trong Menu Dropdown
        authBtnContainer.innerHTML = `
            <div style="padding: 8px 15px; border-bottom: 1px solid #eee; margin-bottom: 5px;">
                <b style="color: #ff385c; display: block;">Chào, ${user.name}</b>
            </div>
            <div id="logout-btn" class="menu-item" style="cursor: pointer; padding: 10px 15px; color: #222;">
                Đăng xuất
            </div>
        `;

        // Gán sự kiện cho nút đăng xuất mới tạo
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            alert("Bạn đã đăng xuất thành công!");
            window.location.reload();
        });
    }

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
});