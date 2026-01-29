# Hệ thống Quản lý Gara Ô tô (Car Garage Management System)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18-green)](#)

---

##  Giới thiệu Dự án

Dự án **DoAn-QuanLyGarageOto** là một giải pháp phần mềm quản lý toàn diện, được thiết kế để tối ưu hóa quy trình vận hành của các gara sửa chữa ô tô hiện đại. Hệ thống tích hợp chặt chẽ các quy trình nghiệp vụ từ khâu tiếp nhận xe, quản lý kỹ thuật sửa chữa, kiểm soát kho phụ tùng cho đến kế toán tài chính và báo cáo quản trị.

**Mục tiêu chính của hệ thống:**
- Tự động hóa các biểu mẫu và quy trình nghiệp vụ theo quy định.
- Kiểm soát chặt chẽ vật tư, phụ tùng và công nợ khách hàng.
- Cung cấp dữ liệu báo cáo chính xác giúp chủ gara đưa ra quyết định kinh doanh hiệu quả.
- Đảm bảo tính toàn vẹn và nhất quán của dữ liệu trong suốt vòng đời giao dịch.

---

##  Các Module Chức Năng Chính

Dựa trên tài liệu đặc tả `design/specs/DESIGN_SPECS.md`, hệ thống được phân chia thành **6 phân hệ cốt lõi**:

### 1. Phân hệ Quản trị (Admin Module)
| Chức năng | Mô tả |
|-----------|-------|
| Quản lý người dùng | Đăng ký, phân quyền cho Nhân viên (Staff) và Quản trị viên (Admin). |
| Cấu hình hệ thống | Thay đổi các tham số nghiệp vụ như số lượng xe tiếp nhận tối đa trong ngày (**QĐ1**, **QĐ6**). |
| Quản lý danh mục | Thiết lập danh mục Hiệu xe (`CAR_BRANDS`), loại Tiền công (`LABOR_FEES`) và bảng giá dịch vụ. |

### 2. Phân hệ Tiếp nhận (Reception Module)
| Chức năng | Mô tả |
|-----------|-------|
| Tiếp nhận xe mới | Ghi nhận thông tin Biển số, Hiệu xe, Chủ xe và thông tin liên lạc theo biểu mẫu **BM1**. |
| Kiểm soát quy định | Tự động kiểm tra giới hạn tiếp nhận xe trong ngày theo tham số `MAX_CARS_RECEIVE` (**QĐ1**). |
| Tra cứu nhanh | Tìm kiếm thông tin xe và lịch sử tiếp nhận dựa trên nhiều tiêu chí (Biển số, Chủ xe, Hiệu xe). |

### 3. Phân hệ Dịch vụ (Service Module)
| Chức năng | Mô tả |
|-----------|-------|
| Lập phiếu sửa chữa | Khởi tạo quy trình bảo trì cho xe đã tiếp nhận theo biểu mẫu **BM2**. |
| Cập nhật nội dung | Thêm vật tư phụ tùng đã sử dụng và các loại tiền công thực hiện vào phiếu. |
| Cơ chế Snapshot | Lưu trữ đơn giá vật tư/tiền công tại thời điểm lập phiếu để đảm bảo tính nhất quán tài chính (**QĐ2**). |

### 4. Phân hệ Kho (Inventory Module)
| Chức năng | Mô tả |
|-----------|-------|
| Quản lý nhập hàng | Lập phiếu nhập kho vật tư từ nhà cung cấp theo biểu mẫu **BM3**. |
| Cập nhật tự động | Tự động cộng tồn kho và cập nhật đơn giá nhập gần nhất cho phụ tùng (**QĐ3**). |
| Kiểm kê tồn kho | Theo dõi số lượng tồn thực tế, đơn vị tính và giá vốn/giá bán cho từng loại vật tư. |

### 5. Phân hệ Tài chính (Finance Module)
| Chức năng | Mô tả |
|-----------|-------|
| Lập phiếu thu tiền | Ghi nhận thanh toán từ khách hàng cho các phiếu sửa chữa theo biểu mẫu **BM4**. |
| Quản lý công nợ | Kiểm soát số tiền thu không được vượt quá số nợ hiện tại của xe (**QĐ4**). |
| Theo dõi dòng tiền | Tự động trừ nợ sau khi hoàn tất giao dịch thanh toán. |

### 6. Phân hệ Báo cáo (Report Module)
| Chức năng | Mô tả |
|-----------|-------|
| Báo cáo doanh số | Thống kê doanh thu theo hiệu xe và tỷ lệ doanh số hàng tháng (**BM5.1**). |
| Báo cáo tồn kho | Theo dõi tồn đầu, phát sinh nhập/xuất và tồn cuối kỳ (**BM5.2**). |
| Báo cáo công nợ | Liệt kê các khách hàng còn dư nợ và biến động nợ trong tháng (**BM5.3**). |

---

##  Công nghệ Sử dụng (Tech Stack)

Hệ thống được xây dựng trên nền tảng Fullstack hiện đại:

| Thành phần | Công nghệ |
|------------|-----------|
| **Backend** | Node.js với Framework Express.js |
| **Frontend** | React.js hoặc Vue.js (Tùy chọn triển khai) |
| **Database** | MySQL 8.0 (Quản lý dữ liệu quan hệ) |
| **Design Tools** | StarUML (Use Case, Class Diagram, Sequence Diagram) |
| **Infrastructure** | Docker (Optional) để triển khai container hóa |

---

##  Yêu cầu Hệ thống (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:

| Công cụ | Phiên bản yêu cầu |
|---------|-------------------|
| **Node.js** | >= 18.0 |
| **MySQL Server** | >= 8.0 |
| **npm** hoặc **yarn** | Phiên bản mới nhất |
| **Git** | Phiên bản mới nhất |

---

##  Hướng dẫn Cài đặt

### Bước 1: Clone Repository
```bash
git clone https://github.com/phuctruong/DoAn-QuanLyGarageOto.git
cd DoAn-QuanLyGarageOto
```

### Bước 2: Cấu hình Backend
```bash
cd server
npm install
```

Tạo tệp `.env` trong thư mục `server/` dựa trên mẫu sau:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=garage_management

# Server Configuration
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

### Bước 3: Khởi tạo Cơ sở dữ liệu
Truy cập MySQL và chạy script khởi tạo:
```bash
mysql -u root -p < database/init.sql
```

Hoặc sử dụng MySQL Workbench để import tệp `database/init.sql`.

### Bước 4: Cấu hình Frontend
```bash
cd ../client
npm install
```

---

##  Cách sử dụng

### Môi trường Phát triển (Development)

**1. Khởi chạy Backend Server:**
```bash
cd server
npm run dev
```
Backend sẽ chạy tại: `http://localhost:5000`

**2. Khởi chạy Frontend Application:**
```bash
cd client
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:3000`

### Môi trường Production (Sử dụng Docker - Optional)
```bash
docker-compose up -d
```

---

##  Cấu trúc Thư mục

```
DoAn-QuanLyGarageOto/
│
├── client/                  # Mã nguồn giao diện người dùng (Frontend)
│   ├── src/
│   │   ├── components/      # Các component React/Vue
│   │   ├── pages/           # Các trang màn hình chính
│   │   ├── services/        # API calls và xử lý dữ liệu
│   │   └── hooks/           # Custom hooks (React)
│   └── package.json
│
├── server/                  # Mã nguồn xử lý logic và API (Backend)
│   ├── controllers/         # Xử lý request/response
│   ├── services/            # Business logic
│   ├── models/              # Database models và queries
│   ├── routes/              # Định nghĩa API endpoints
│   ├── middleware/          # Auth, validation middleware
│   └── package.json
│
├── database/                # Các script SQL khởi tạo cơ sở dữ liệu
│   └── init.sql             # Script tạo bảng và dữ liệu mẫu
│
├── design/                  # Tài liệu thiết kế hệ thống
│   ├── diagrams/            # Các sơ đồ Use Case, Class, Sequence
│   │   ├── exported/        # Hình ảnh sơ đồ đã xuất (PNG, SVG)
│   │   └── *.mdj            # Tệp nguồn StarUML
│   └── specs/               # Đặc tả nghiệp vụ và Schema chi tiết
│       ├── CORE_SCHEMA.md   # Định nghĩa cơ sở dữ liệu
│       └── DESIGN_SPECS.md  # Đặc tả chức năng các module
│
├── docs/                    # Tài liệu dự án
│   ├── project/             # SRS, SDD, Mô tả đề tài
│   └── references/          # Tài liệu tham khảo
│
├── reports/                 # Báo cáo đồ án và tiến độ thực hiện
│   └── BaoCao.docx
│
├── .env.example             # Tệp mẫu cấu hình môi trường
├── AGENTS.md                # Hướng dẫn cho AI Agents
├── CONTRIBUTING.md          # Hướng dẫn đóng góp mã nguồn
├── LICENSE                  # Giấy phép sử dụng (MIT)
└── README.md                # Tài liệu hướng dẫn này
```

---

##  Thành viên thực hiện

Dự án được thực hiện bởi nhóm sinh viên lớp **Phát triển Phần mềm**:

| STT | Họ và Tên | MSSV | Vai trò |
|-----|-----------|------|---------|
| 1 | [Họ và Tên] | [MSSV] | Team Leader / Backend Developer |
| 2 | [Họ và Tên] | [MSSV] | Frontend Developer |
| 3 | [Họ và Tên] | [MSSV] | Database Designer / Tester |

---

##  Liên hệ

- **Email:** [email@example.com]
- **GitHub:** [https://github.com/phuctruong/DoAn-QuanLyGarageOto](https://github.com/phuctruong/DoAn-QuanLyGarageOto)

---

##  Giấy phép

Dự án này được cấp phép theo giấy phép **MIT License** - xem tệp [LICENSE](LICENSE) để biết thêm chi tiết.

---

*Dự án được thực hiện trong khuôn khổ môn học Phát triển Phần mềm - 2026*
