# Checklist Triển khai (Deploy Checklist)

Tài liệu này hướng dẫn các bước và các checklist cần kiểm tra khi đưa ứng dụng lên môi trường Production.

## 1. Môi trường (Environment Variables)

### Backend (.env)
- `PORT`: (Mặc định do host cung cấp, VD trên Render là tự động).
- `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster...`
- `JWT_SECRET`: Chuỗi ký tự bí mật dài và ngẫu nhiên.
- `CORS_ORIGIN`: `https://ten-mien-frontend.vercel.app`
- `GEMINI_API_KEY`: Key thật từ Google AI Studio.

### Frontend (.env)
- `VITE_API_URL`: `https://ten-mien-backend.onrender.com`

---

## 2. Các Nền tảng Deploy

### 2.1 Backend (Render.com)
- **Tạo Web Service mới**.
- Kéo source từ nhánh `main` (hoặc nhánh deploy).
- Build command: `npm install`
- Start command: `node src/server.js` hoặc `npm start`
- *Lưu ý:* Phải thiết lập đầy đủ Environment Variables trên Dashboard của Render.

### 2.2 Frontend (Vercel)
- **Tạo Project mới** và link tới Github.
- Framework Preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- *Lưu ý:* Thiết lập `VITE_API_URL` trong phần Environment Variables của Vercel.

### 2.3 Database (MongoDB Atlas)
- Ensure **Network Access (IP Allowlist)** được cấu hình cho phép IP của Backend (hoặc mở `0.0.0.0/0` nếu Render đổi IP liên tục).
- Đảm bảo tài khoản database có quyền `readWriteAnyDatabase`.

---

## 3. Checklist Trước Khi Demo
- [ ] Truy cập URL Frontend công khai và kiểm tra xem giao diện có vỡ không.
- [ ] Tạo mới một tài khoản bệnh nhân.
- [ ] Thử tính năng Đặt lịch (Gửi API về Backend thành công).
- [ ] Đăng nhập tài khoản Admin, kiểm tra xem có thấy lịch vừa đặt không.
- [ ] Nhắn tin với Chatbot xem có phản hồi không (Đảm bảo GEMINI_API_KEY đang hoạt động).
