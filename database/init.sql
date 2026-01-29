-- Script khởi tạo cơ sở dữ liệu cho Hệ thống Quản lý Gara Ô tô
-- Ngày tạo: 29/01/2026
-- Tác giả: Team Phát triển Phần mềm

CREATE DATABASE IF NOT EXISTS garage_management;
USE garage_management;

-- =============================================
-- 1. DANH MỤC VÀ CẤU HÌNH HỆ THỐNG
-- =============================================

-- Bảng tham số quy định (QĐ1, QĐ6)
CREATE TABLE IF NOT EXISTS PARAMETERS (
    param_key VARCHAR(50) PRIMARY KEY COMMENT 'Tên tham số (VD: MAX_CARS_RECEIVE)',
    param_value INT NOT NULL COMMENT 'Giá trị tham số'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Lưu trữ các quy định hệ thống';

-- Bảng người dùng hệ thống (Admin, Staff)
CREATE TABLE IF NOT EXISTS USERS (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT 'Tên đăng nhập',
    password VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã mã hóa (BCrypt)',
    role ENUM('Admin', 'Staff') DEFAULT 'Staff' COMMENT 'Vai trò người dùng',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng hiệu xe (Toyota, Honda...)
CREATE TABLE IF NOT EXISTS CAR_BRANDS (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL UNIQUE COMMENT 'Tên hiệu xe'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng danh mục tiền công
CREATE TABLE IF NOT EXISTS LABOR_FEES (
    labor_id INT AUTO_INCREMENT PRIMARY KEY,
    labor_name VARCHAR(255) NOT NULL COMMENT 'Tên loại tiền công',
    price DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT 'Đơn giá tiền công hiện tại'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 2. KHÁCH HÀNG VÀ XE
-- =============================================

-- Bảng khách hàng
CREATE TABLE IF NOT EXISTS CUSTOMERS (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL COMMENT 'Họ tên chủ xe',
    phone VARCHAR(20) NOT NULL COMMENT 'Số điện thoại',
    address VARCHAR(255) COMMENT 'Địa chỉ liên hệ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng xe (Thông tin xe tiếp nhận)
CREATE TABLE IF NOT EXISTS CARS (
    license_plate VARCHAR(20) PRIMARY KEY COMMENT 'Biển số xe (Khóa chính)',
    brand_id INT NOT NULL COMMENT 'Mã hiệu xe',
    customer_id INT NOT NULL COMMENT 'Mã chủ xe',
    current_debt DECIMAL(15, 2) DEFAULT 0 COMMENT 'Số tiền nợ hiện tại của xe',
    received_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tiếp nhận gần nhất',
    FOREIGN KEY (brand_id) REFERENCES CAR_BRANDS(brand_id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES CUSTOMERS(customer_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 3. KHO VÀ VẬT TƯ
-- =============================================

-- Bảng nhà cung cấp
CREATE TABLE IF NOT EXISTS SUPPLIERS (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL COMMENT 'Tên nhà cung cấp',
    phone VARCHAR(20),
    address VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng vật tư phụ tùng
CREATE TABLE IF NOT EXISTS SUPPLIES (
    supply_id INT AUTO_INCREMENT PRIMARY KEY,
    supply_name VARCHAR(255) NOT NULL COMMENT 'Tên vật tư',
    unit VARCHAR(50) NOT NULL COMMENT 'Đơn vị tính',
    stock_qty INT DEFAULT 0 COMMENT 'Số lượng tồn kho',
    import_price DECIMAL(15, 2) DEFAULT 0 COMMENT 'Đơn giá nhập gần nhất',
    sell_price DECIMAL(15, 2) DEFAULT 0 COMMENT 'Đơn giá bán hiện tại'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng phiếu nhập kho
CREATE TABLE IF NOT EXISTS IMPORTS (
    import_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    import_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày nhập hàng',
    total_amount DECIMAL(15, 2) DEFAULT 0 COMMENT 'Tổng tiền phiếu nhập',
    FOREIGN KEY (supplier_id) REFERENCES SUPPLIERS(supplier_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng chi tiết phiếu nhập (Cập nhật QĐ3)
CREATE TABLE IF NOT EXISTS IMPORT_DETAILS (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    import_id INT NOT NULL,
    supply_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0) COMMENT 'Số lượng nhập',
    import_price DECIMAL(15, 2) NOT NULL CHECK (import_price >= 0) COMMENT 'Đơn giá nhập tại thời điểm này',
    FOREIGN KEY (import_id) REFERENCES IMPORTS(import_id) ON DELETE CASCADE,
    FOREIGN KEY (supply_id) REFERENCES SUPPLIES(supply_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 4. NGHIỆP VỤ SỬA CHỮA VÀ THANH TOÁN
-- =============================================

-- Bảng phiếu sửa chữa
CREATE TABLE IF NOT EXISTS SERVICE_TICKETS (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    license_plate VARCHAR(20) NOT NULL,
    service_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày lập phiếu',
    status ENUM('Pending', 'Processing', 'Completed') DEFAULT 'Pending' COMMENT 'Trạng thái: Chờ, Đang sửa, Xong',
    total_amount DECIMAL(15, 2) DEFAULT 0 COMMENT 'Tổng tiền sửa chữa',
    FOREIGN KEY (license_plate) REFERENCES CARS(license_plate) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng chi tiết phiếu sửa chữa (Snapshot giá - QĐ2)
CREATE TABLE IF NOT EXISTS TICKET_DETAILS (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    supply_id INT COMMENT 'Mã vật tư (Có thể Null nếu chỉ tính công)',
    labor_id INT COMMENT 'Mã tiền công (Có thể Null nếu chỉ bán vật tư)',
    quantity INT DEFAULT 1 COMMENT 'Số lượng vật tư',
    supply_price DECIMAL(15, 2) DEFAULT 0 COMMENT 'Giá vật tư tại thời điểm sửa (Snapshot)',
    labor_price DECIMAL(15, 2) DEFAULT 0 COMMENT 'Giá tiền công tại thời điểm sửa (Snapshot)',
    total_price DECIMAL(15, 2) GENERATED ALWAYS AS ((quantity * supply_price) + labor_price) STORED COMMENT 'Thành tiền dòng',
    FOREIGN KEY (ticket_id) REFERENCES SERVICE_TICKETS(ticket_id) ON DELETE CASCADE,
    FOREIGN KEY (supply_id) REFERENCES SUPPLIES(supply_id) ON DELETE RESTRICT,
    FOREIGN KEY (labor_id) REFERENCES LABOR_FEES(labor_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng phiếu thu tiền (QĐ4)
CREATE TABLE IF NOT EXISTS PAYMENTS (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    license_plate VARCHAR(20) NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày thu tiền',
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0) COMMENT 'Số tiền thu',
    FOREIGN KEY (license_plate) REFERENCES CARS(license_plate) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 5. DỮ LIỆU KHỞI TẠO (SEEDING)
-- =============================================

-- Cấu hình tham số mặc định (QĐ1)
INSERT INTO PARAMETERS (param_key, param_value) VALUES 
('MAX_CARS_RECEIVE', 30);

-- Tài khoản Admin mặc định (Password: admin123 - cần hash lại trong thực tế)
INSERT INTO USERS (username, password, role) VALUES 
('admin', '$2b$10$EpOd.z.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p', 'Admin');

-- Danh mục hiệu xe mẫu
INSERT INTO CAR_BRANDS (brand_name) VALUES 
('Toyota'), ('Honda'), ('Ford'), ('Hyundai'), ('Mazda'), ('Kia');

-- Danh mục tiền công mẫu
INSERT INTO LABOR_FEES (labor_name, price) VALUES 
('Rửa xe', 50000),
('Thay nhớt', 100000),
('Kiểm tra tổng quát', 200000),
('Cân chỉnh thước lái', 350000);
