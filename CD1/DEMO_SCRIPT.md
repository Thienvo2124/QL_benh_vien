# Kịch bản Thuyết trình & Demo Sản phẩm (Thời lượng: 7-10 phút)

**Người thuyết trình (Dự kiến):** Thành viên 3

---

## 1. Mở đầu (1 phút)
- **Chào hỏi:** "Xin chào Thầy/Cô và các bạn, nhóm chúng em xin được trình bày dự án 'Hệ thống Quản lý Bệnh viện Số'."
- **Lý do chọn đề tài:** Trình bày ngắn gọn thực trạng quá tải ở các bệnh viện và nhu cầu số hóa quy trình khám chữa bệnh.
- **Mục tiêu dự án:** Cung cấp trải nghiệm đặt lịch online cho bệnh nhân và hệ thống quản lý tập trung cho y bác sĩ.

## 2. Demo luồng Bệnh nhân (3 phút)
- **Trang chủ:** Mở URL của ứng dụng, giới thiệu giao diện thân thiện, responsive.
- **Tính năng Chatbot:** 
  - Mở cửa sổ Chatbot.
  - Gõ một câu hỏi: "Tôi bị đau ngực thì nên khám khoa nào?"
  - Chỉ ra tính ưu việt của AI khi tư vấn điều hướng cho bệnh nhân.
- **Đặt lịch khám:** 
  - Đăng nhập bằng tài khoản Bệnh nhân (Ví dụ: `patient1@gmail.com`).
  - Chọn Chuyên khoa -> Chọn Bác sĩ -> Chọn Ngày giờ.
  - Hoàn tất và chỉ ra thông báo thành công.

## 3. Demo luồng Quản trị & Bác sĩ (3 phút)
- **Đăng nhập Admin:**
  - Log out tài khoản bệnh nhân, đăng nhập bằng `admin@gmail.com`.
- **Dashboard:**
  - Giới thiệu tổng quan các con số thống kê (Số bệnh nhân, số lịch hẹn hôm nay...).
- **Xử lý Lịch hẹn:**
  - Vào phần Lịch hẹn, chỉ ra lịch vừa đặt ban nãy đang ở trạng thái "Chờ duyệt".
  - Admin/Bác sĩ bấm duyệt lịch -> Trạng thái đổi thành "Đã xác nhận".
- **Quản lý Bệnh án:**
  - Vào mục Bệnh án (nếu có), tạo nhanh một bệnh án cho bệnh nhân sau khi khám xong.
- **Phân quyền người dùng (Tính năng nổi bật):**
  - Vào mục Người dùng, biểu diễn việc đổi quyền từ "Bệnh nhân" lên "Y tá" trực tiếp trên bảng dữ liệu.

## 4. Tổng kết & Trả lời câu hỏi (1-2 phút)
- **Công nghệ sử dụng:** ReactJS, Tailwind, NodeJS, Express, MongoDB, Google Gemini AI.
- **Khó khăn & Bài học:** (Nêu ngắn gọn việc tích hợp AI hoặc bảo mật JWT).
- **Cảm ơn:** "Cảm ơn Thầy/Cô đã lắng nghe. Sau đây nhóm xin nhận các câu hỏi phản biện."
