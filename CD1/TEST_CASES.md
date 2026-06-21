# Kịch bản Kiểm thử (Test Cases) - Hệ thống Bệnh viện Số

Tài liệu này định nghĩa các kịch bản kiểm thử thủ công (Manual Test Cases) cho các chức năng chính yếu của hệ thống.

---

## 1. Module Xác thực (Authentication)

### TC-AUTH-01: Đăng ký tài khoản bệnh nhân thành công
- **Mục tiêu:** Kiểm tra xem người dùng có thể đăng ký tài khoản với quyền `patient` thành công hay không.
- **Bước thực hiện:**
  1. Truy cập trang Đăng ký (`/register`).
  2. Nhập Họ và tên: `Nguyễn Văn Test`.
  3. Nhập Email: `test.patient1@gmail.com`.
  4. Nhập Mật khẩu & Xác nhận mật khẩu: `123456`.
  5. Tick chọn Đồng ý điều khoản.
  6. Bấm nút "Đăng ký".
- **Dữ liệu test:** `test.patient1@gmail.com` / `123456`
- **Kết quả mong đợi:** Hệ thống báo "Đăng ký thành công", chuyển hướng về trang Đăng nhập.
- **Kết quả thực tế:** [Chờ điền]

### TC-AUTH-02: Đăng nhập tài khoản Admin
- **Mục tiêu:** Kiểm tra chức năng đăng nhập và chuyển hướng đúng dashboard dành cho Admin.
- **Bước thực hiện:**
  1. Truy cập trang Đăng nhập (`/login`).
  2. Nhập Email: `admin@gmail.com`.
  3. Nhập Mật khẩu: `123456`.
  4. Bấm nút "Đăng nhập".
- **Dữ liệu test:** `admin@gmail.com` / `123456`
- **Kết quả mong đợi:** Đăng nhập thành công, token được lưu vào localStorage, tự động chuyển hướng đến `/dashboard`.
- **Kết quả thực tế:** [Chờ điền]

---

## 2. Module Đặt lịch khám (Booking)

### TC-BOOK-01: Đặt lịch khám thành công
- **Mục tiêu:** Kiểm tra quá trình đặt lịch khám bệnh của người dùng.
- **Bước thực hiện:**
  1. Đăng nhập với tài khoản `patient`.
  2. Truy cập trang Đặt lịch (`/booking`).
  3. Chọn chuyên khoa "Tim mạch", chọn Bác sĩ "Nguyễn Minh Tuấn".
  4. Chọn Ngày khám (ví dụ: ngày mai) và Giờ khám (08:00 - 09:00).
  5. Điền Lý do khám: "Đau tức ngực".
  6. Bấm "Xác nhận đặt lịch".
- **Dữ liệu test:** Chuyên khoa Tim mạch, Lý do khám "Đau tức ngực".
- **Kết quả mong đợi:** Lịch hẹn được tạo với trạng thái "Chờ duyệt" (Pending). Hệ thống hiển thị thông báo thành công.
- **Kết quả thực tế:** [Chờ điền]

---

## 3. Module Quản trị viên (Admin Dashboard)

### TC-ADM-01: Phân quyền người dùng (Đổi Role)
- **Mục tiêu:** Kiểm tra khả năng đổi quyền (role) của Admin cho một user khác.
- **Bước thực hiện:**
  1. Đăng nhập tài khoản Admin, vào mục `/dashboard/users`.
  2. Tìm một tài khoản `patient` trong danh sách.
  3. Ở cột Cấp quyền, bấm Dropdown và chọn "Bác sĩ" (doctor).
- **Dữ liệu test:** Đổi tài khoản `test.patient1@gmail.com` thành `doctor`.
- **Kết quả mong đợi:** Hệ thống hiển thị "Cập nhật quyền thành công", icon trên bảng chuyển sang Bác sĩ, dữ liệu trong MongoDB được cập nhật.
- **Kết quả thực tế:** [Chờ điền]

### TC-ADM-02: Duyệt lịch khám
- **Mục tiêu:** Quản trị viên có thể thay đổi trạng thái của lịch khám.
- **Bước thực hiện:**
  1. Đăng nhập tài khoản Admin, vào mục `/dashboard/appointments`.
  2. Tìm lịch hẹn đang có trạng thái "Chờ duyệt".
  3. Bấm vào Dropdown trạng thái và đổi thành "Đã xác nhận".
- **Kết quả mong đợi:** Trạng thái chuyển sang "Đã xác nhận", thẻ trạng thái đổi màu xanh.
- **Kết quả thực tế:** [Chờ điền]

---

## 4. Module Bệnh án & Đơn thuốc (Medical Records)

### TC-MED-01: Tạo bệnh án mới sau khi khám
- **Mục tiêu:** Đảm bảo Bác sĩ/Admin có thể tạo bệnh án cho lịch khám đã hoàn thành.
- **Bước thực hiện:**
  1. Đăng nhập Admin/Doctor.
  2. Chuyển trạng thái lịch khám thành "Đã hoàn thành".
  3. Vào trang Bệnh án (`/dashboard/medical-records`), bấm "Thêm bệnh án".
  4. Chọn Lịch khám vừa hoàn thành.
  5. Điền Chẩn đoán: "Rối loạn nhịp tim", Đơn thuốc: "Thuốc trợ tim A, ngày 2 viên".
  6. Lưu bệnh án.
- **Kết quả mong đợi:** Bệnh án được lưu thành công, liên kết đúng với Patient và Doctor tương ứng.
- **Kết quả thực tế:** [Chờ điền]
