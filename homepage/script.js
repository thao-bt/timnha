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