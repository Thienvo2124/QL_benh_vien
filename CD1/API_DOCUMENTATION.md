# Tài liệu API (API Documentation) - Hệ thống Bệnh viện Số

Tài liệu này liệt kê các API endpoints chính của hệ thống, phục vụ cho ứng dụng Web. Các request/response đều sử dụng định dạng JSON.

`Base URL: http://localhost:5000` (hoặc URL thực tế khi deploy)

---

## 1. Authentication (`/api/auth`)

### 1.1 Đăng ký tài khoản (Register)
- **Method:** `POST`
- **URL:** `/api/auth/register`
- **Auth required:** Không
- **Request Body:**
  ```json
  {
    "fullName": "Nguyễn Văn A",
    "email": "nva@gmail.com",
    "password": "password123"
  }
  ```
- **Response thành công (201):**
  ```json
  {
    "message": "Đăng ký thành công",
    "userId": "60d5ecb8b487343568912345"
  }
  ```

### 1.2 Đăng nhập (Login)
- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Auth required:** Không
- **Request Body:**
  ```json
  {
    "email": "nva@gmail.com",
    "password": "password123"
  }
  ```
- **Response thành công (200):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1...",
    "user": {
      "_id": "60d5ecb8b487343568912345",
      "email": "nva@gmail.com",
      "fullName": "Nguyễn Văn A",
      "role": "patient"
    }
  }
  ```

---

## 2. Quản lý Người dùng (`/api/users`)

### 2.1 Lấy danh sách người dùng
- **Method:** `GET`
- **URL:** `/api/users`
- **Auth required:** Có (Admin)
- **Response thành công (200):**
  ```json
  [
    {
      "_id": "60d5ec...",
      "fullName": "Adminstrator",
      "email": "admin@gmail.com",
      "role": "admin",
      "createdAt": "2023-10-01T12:00:00Z"
    }
  ]
  ```

### 2.2 Cập nhật quyền người dùng
- **Method:** `PUT`
- **URL:** `/api/users/:id/role`
- **Auth required:** Có (Admin)
- **Request Body:**
  ```json
  {
    "role": "doctor"
  }
  ```
- **Response thành công (200):**
  ```json
  {
    "message": "Cập nhật quyền thành công",
    "user": { ... }
  }
  ```

---

## 3. Đặt lịch khám (`/api/appointments`)

### 3.1 Tạo lịch hẹn mới (Booking)
- **Method:** `POST`
- **URL:** `/api/appointments`
- **Auth required:** Có (Patient/User)
- **Request Body:**
  ```json
  {
    "name": "Nguyễn Văn A",
    "phone": "0901234567",
    "gender": "Nam",
    "dept": "Tim mạch",
    "doctor": "BS. Tuấn",
    "date": "2023-10-15T00:00:00.000Z",
    "time": "08:00",
    "reason": "Khám định kỳ"
  }
  ```
- **Response thành công (201):**
  ```json
  {
    "message": "Đặt lịch khám thành công",
    "appointment": {
      "appointmentCode": "APT-12345",
      "status": "pending",
      ...
    }
  }
  ```

### 3.2 Lấy danh sách lịch hẹn
- **Method:** `GET`
- **URL:** `/api/appointments`
- **Auth required:** Có (Admin/Doctor)
- **Response thành công (200):** Trả về mảng các object Lịch khám.

---

*(Tài liệu này sẽ tiếp tục được cập nhật khi các API cho Bệnh nhân, Bệnh án và Thuốc được nhóm Backend hoàn thiện).*
