# Hệ thống Quản lý Gara Ô tô (DoAn-QuanLyGarageOto)

## 1. Tổng quan dự án
Dự án **Hệ thống Quản lý Gara Ô tô** là một giải pháp phần mềm toàn diện nhằm tối ưu hóa quy trình vận hành của một gara sửa chữa xe. Hệ thống hỗ trợ quản lý từ khâu tiếp nhận xe, sửa chữa, quản lý kho phụ tùng đến theo dõi tài chính và lập báo cáo định kỳ.

Hệ thống được thiết kế với các module chính:
- **Quản trị (Admin)**: Quản lý người dùng, phân quyền, cấu hình tham số hệ thống và danh mục.
- **Tiếp nhận (Reception)**: Ghi nhận thông tin xe và chủ xe khi vào gara.
- **Dịch vụ (Service)**: Theo dõi quá trình sửa chữa, sử dụng vật tư và tính tiền công.
- **Kho (Inventory)**: Quản lý nhập/xuất vật tư phụ tùng và kiểm soát tồn kho.
- **Tài chính (Finance)**: Quản lý thu tiền và theo dõi công nợ của khách hàng.
- **Báo cáo (Report)**: Tổng hợp số liệu doanh số, tồn kho và công nợ hàng tháng.

## 2. Các tính năng chính
Dựa trên tài liệu đặc tả thiết kế, hệ thống bao gồm các chức năng:
- **Tiếp nhận xe**: Kiểm tra giới hạn số lượng xe tiếp nhận tối đa trong ngày (QĐ1).
- **Lập phiếu sửa chữa**: Tự động tính toán chi phí dựa trên đơn giá vật tư và tiền công tại thời điểm lập phiếu (QĐ2).
- **Quản lý nhập kho**: Cập nhật số lượng tồn kho và đơn giá nhập mới nhất khi có vật tư mới (QĐ3).
- **Thu tiền & Công nợ**: Đảm bảo số tiền thu không vượt quá số nợ hiện tại của khách hàng (QĐ4).
- **Tra cứu**: Tìm kiếm nhanh chóng thông tin xe, khách hàng và tình trạng tồn kho.
- **Báo cáo định kỳ**: Tự động kết xuất báo cáo doanh thu, báo cáo tồn và báo cáo nợ hàng tháng.

## 3. Công nghệ sử dụng (Dự kiến)
- **Frontend**: React.js
- **Backend**: Node.js (Express)
- **Database**: MySQL
- **Công cụ thiết kế**: StarUML (cho các sơ đồ Use Case, Class Diagram)

## 4. Cấu trúc thư mục dự án
Thư mục dự án được tổ chức như sau:
- `docs/`: Chứa các tài liệu đặc tả chức năng (SRS), mô tả đề tài và tài liệu tham khảo.
- `design/`: Bao gồm các sơ đồ thiết kế (diagrams), mô hình dữ liệu và đặc tả kỹ thuật (`specs`).
- `reports/`: Lưu trữ các báo cáo tiến độ, báo cáo đồ án và các tệp liên quan.

## 5. Hướng dẫn cài đặt (Placeholder)
Hiện tại dự án đang trong giai đoạn thiết kế và phát triển sơ khai. Các bước cài đặt dự kiến:

1. **Clone project**:
   ```bash
   git clone https://github.com/your-username/DoAn-QuanLyGarageOto.git
   ```
2. **Cài đặt dependencies**:
   ```bash
   cd DoAn-QuanLyGarageOto
   npm install
   ```
3. **Cấu hình cơ sở dữ liệu**:
   - Tạo database MySQL.
   - Cấu hình thông tin kết nối trong tệp `.env`.
4. **Khởi chạy ứng dụng**:
   ```bash
   npm run dev
   ```

---
*Dự án được thực hiện trong khuôn khổ môn học Phát triển Phần mềm.*
