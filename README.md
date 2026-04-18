Tìm Nhà - Website Tìm Kiếm Phòng Trọ
Dự án này là một website hỗ trợ người dùng tìm kiếm phòng trọ và xem chi tiết các địa điểm thuê nhà, được tối ưu hóa giao diện cho cả máy tính và điện thoại.

Tính năng chính
Trang chủ (Homepage): Tìm kiếm và lọc danh sách các phòng trọ/nhà cho thuê.

Chi tiết (Detail): Xem thông tin chi tiết, hình ảnh và giá cả của từng phòng.

Đăng ký/Đăng nhập: Quản lý tài khoản người dùng.

Tìm kiếm thông minh: Hỗ trợ phím Enter và tối ưu tìm kiếm trên thiết bị di động.

Cấu trúc thư mục
/image: Chứa các hình ảnh minh họa của dự án.

homepage.html / .css / .js: Giao diện và logic trang chủ.

detail.html / .css / .js: Giao diện và logic trang chi tiết.

login_feature.js: Xử lý logic đăng nhập.

place.json: Cơ sở dữ liệu mẫu dạng JSON chứa thông tin địa điểm.

Hướng dẫn cài đặt và chạy dự án
Để chạy dự án này trên VS Code tại máy cá nhân, làm theo các bước sau:

1. Clone dự án về máy
Mở Terminal trên máy tính của bạn (hoặc Terminal trong VS Code) và chạy lệnh sau:
git clone https://github.com/thao-bt/timnha.git

3. Mở dự án bằng VS Code
cd timnha
code .

5. Cách chạy website
Cách đơn giản nhất là cài đặt Extension Live Server trên VS Code.

Sau khi cài đặt, chuột phải vào file homepage.html và chọn Open with Live Server.

Website sẽ tự động mở trên trình duyệt tại địa chỉ http://127.0.0.1:8000.

Công nghệ sử dụng
Frontend: HTML5, CSS3, JavaScript (ES6)
Data: JSON
Version Control: Git & GitHub
