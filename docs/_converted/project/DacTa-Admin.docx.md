# Source
docs/project/DacTa-Admin.docx

# Conversion method
pandoc

I. QUẢN LÝ NHÂN SỰ (USER MANAGEMENT)

1\. Kịch bản nghiệp vụ (Flow of Events)

A. Luồng chính (Thêm mới nhân viên)

-   **Admin** truy cập vào menu \"Quản trị hệ thống\" và chọn \"Quản lý
    nhân sự\".

-   Hệ thống hiển thị danh sách nhân viên hiện tại.

-   **Admin** nhấn nút \"Thêm mới\".

-   **Admin** nhập các thông tin: Họ tên, Tên đăng nhập, Mật khẩu, Chọn
    vai trò (Lễ tân/Kho/\...) và Trạng thái.

-   **Admin** nhấn \"Lưu\".

-   Hệ thống kiểm tra tính hợp lệ:

<!-- -->

-   Tên đăng nhập đã tồn tại hay chưa?

-   Các trường bắt buộc có bị bỏ trống không?

<!-- -->

-   Hệ thống ghi dữ liệu vào cơ sở dữ liệu và thông báo \"Thêm mới thành
    công\".

B. Luồng cập nhật/Khóa tài khoản

-   **Admin** chọn một nhân viên từ danh sách.

-   **Admin** thay đổi thông tin cần thiết (Vai trò, Họ tên,\...) hoặc
    chuyển Trạng thái sang \"Khóa\".

-   Hệ thống lưu cập nhật và áp dụng quyền mới ngay lập tức cho tài
    khoản đó.

2\. Các quy định và ràng buộc (Business Rules)

-   **Quy định về bảo mật:** Mật khẩu khi lưu vào Database phải được mã
    hóa, không hiển thị dưới dạng văn bản thuần (Plain text).

-   **Quy định về vai trò:** Mỗi nhân viên chỉ được gán một vai trò
    chính để giới hạn phạm vi truy cập (ví dụ: Nhân viên Kho không được
    xem Phiếu thu tiền).

-   **Quy định xóa:** Không cho phép xóa vĩnh viễn nhân viên đã từng
    thực hiện giao dịch (Lập phiếu sửa chữa, Nhập kho) để giữ tính toàn
    vẹn dữ liệu báo cáo. Thay vào đó, chỉ được sử dụng chức năng \"Khóa
    tài khoản\".

-   **Tham số quy định (QĐ6):** Việc phân quyền phải tương ứng với 6
    phân hệ chức năng đã thiết kế.

3\. Sơ đồ use case

![](media/image1.png){width="6.5in" height="3.09375in"}

II\. QUẢN LÝ DANH MỤC (CATEGORY MANAGEMENT)

1\. Thông tin chung

**Tác nhân (Actor):** Admin (Quản trị viên).

**Mục đích:** Thiết lập các bảng dữ liệu dùng chung cho toàn hệ thống để
đảm bảo tính thống nhất và dễ dàng cập nhật giá cả, thương hiệu.

2\. Các đối tượng quản lý (Sub-categories)

-   **Danh mục Hiệu xe (CAR_BRANDS):** Toyota, Honda, Ford, BMW\....

-   **Danh mục Vật tư phụ tùng (SUPPLIES):** Tên vật tư, Đơn vị tính,
    Đơn giá bán, Số lượng tồn.

3\. Kịch bản nghiệp vụ (Flow of Events)

-   **Bước 1:** Admin chọn loại danh mục cần quản lý (ví dụ: Tiền công).

-   **Bước 2:** Hệ thống hiển thị danh sách các mục đã có.

-   **Bước 3 (Thêm/Sửa):** Admin nhập tên mục mới và đơn giá niêm yết.

-   **Bước 4 (Lưu):** Hệ thống kiểm tra:

<!-- -->

-   Tên hiệu xe hoặc loại tiền công không được trùng lặp.

-   Đơn giá phải là số dương.

<!-- -->

-   **Bước 5:** Dữ liệu mới sẽ khả dụng ngay lập tức khi Lễ tân tiếp
    nhận xe hoặc Thợ lập phiếu sửa chữa.

4\. Các quy định và ràng buộc (Business Rules)

-   **Ràng buộc Snapshot:** Khi thay đổi đơn giá vật tư trong danh mục,
    giá trên các Phiếu sửa chữa **đã lập trước đó** tuyệt đối không được
    thay đổi (giữ nguyên giá lịch sử).

-   **Quy tắc xóa:** Không được xóa các danh mục đã có dữ liệu liên kết
    (ví dụ: Không xóa hiệu xe \"Toyota\" nếu đang có xe Toyota trong
    xưởng).

5\. Sơ đồ use case

![](media/image2.png){width="6.5in" height="4.145833333333333in"}

III\. Cấu hình tham số quy định

1\. Thông tin chung

**Tác nhân (Actor):** Admin (Quản trị viên).

**Mục đích:** Cho phép thay đổi các giới hạn và tỷ lệ tính toán trong
quy trình nghiệp vụ của Gara.

2\. Các tham số quan trọng cần quản lý

-   **Số xe tiếp nhận tối đa (MAX_CARS_RECEIVE):** Mặc định là 30
    xe/ngày. Nếu Admin đổi thành 40, bộ phận Lễ tân sẽ có thể check-in
    thêm xe.

-   **Tỷ lệ lãi suất vật tư:** Dùng để tự động tính đơn giá bán dựa trên
    giá vốn nhập kho (Ví dụ: Đơn giá bán = Giá vốn \* 120%).

-   **Quy định thu tiền:** Cho phép hoặc không cho phép thu tiền vượt
    quá số nợ (Mặc định là KHÔNG).

3\. Sơ đồ Use Case

![](media/image3.png){width="6.5in" height="3.386111111111111in"}

4\. Kịch bản nghiệp vụ (Flow of Events)

-   **Admin** truy cập menu \"Cấu hình hệ thống\".

-   Hệ thống hiển thị danh sách các tham số hiện tại cùng giá trị của
    chúng.

-   **Admin** chọn tham số cần chỉnh sửa (ví dụ: đổi 30 xe thành 50 xe).

-   **Admin** nhấn \"Cập nhật\".

-   Hệ thống thực hiện:

    -   Kiểm tra tính hợp lệ (Giá trị phải là số dương).

    -   Tiến hành thay đổi.

-   Hệ thống thông báo thành công và áp dụng ngay lập tức cho toàn gara.

5\. Quy tắc nghiệp vụ (Business Rules)

-   **Tính tức thời:** Sau khi Admin nhấn lưu, nhân viên Lễ tân thực
    hiện Check-in xe tiếp theo sẽ bị áp dụng ngay luật mới mà không cần
    khởi động lại phần mềm.

-   **Lịch sử thay đổi:** Nên lưu lại lịch sử (Log) ai đã sửa tham số
    nào, vào lúc nào để đối soát khi có sai lệch nghiệp vụ.

IV\. XEM BÁO CÁO THỐNG KÊ

1 Thông tin chung

**Tác nhân (Actor):** Admin (Quản trị viên).

**Mục đích:** Cung cấp cái nhìn tổng thể về doanh thu, tình hình kho bãi
và các khoản nợ chưa thu hồi.

2\. Các loại báo cáo chính (BM5)

-   **Báo cáo Doanh số (BM5.1):** Thống kê theo Hiệu xe. Tính tổng thành
    tiền và tỷ lệ phần trăm số lượt sửa của từng hiệu xe trong tháng.

-   **Báo cáo Tồn kho (BM5.2):** Kiểm soát biến động vật tư. Tính toán
    dựa trên công thức:

    -   **Tồn Cuối:** Lấy từ số lượng thực tế hiện có trong bảng vật tư.

    -   **Phát sinh Nhập/Xuất:** Tổng hợp từ phiếu nhập và phiếu sửa
        chữa trong tháng.

-   **Báo cáo Công nợ (BM5.3):** Liệt kê danh sách các xe còn nợ tiền
    (current_debt \> 0) để theo dõi thu hồi vốn.

3 Kịch bản nghiệp vụ (Flow of Events)

-   **Admin** chọn phân hệ \"Xem báo cáo - Thống kê\".

-   **Admin** chọn loại báo cáo cần xem (Doanh số / Tồn kho / Công nợ).

-   **Admin** chọn mốc thời gian (Tháng/Năm).

-   Hệ thống thực hiện truy vấn và tính toán dữ liệu và hiện dữ liệu ra

-   Hệ thống hiển thị báo cáo dưới dạng bảng và biểu đồ.

**Công thức tính**\
Doanh số tháng:

![](media/image4.png){width="5.858840769903762in"
height="0.4500393700787402in"}

Tồn kho:

![](media/image5.png){width="4.6670713035870515in"
height="0.29169181977252845in"}

**Ràng buộc thời gian:** Báo cáo chỉ được phép truy xuất sau khi tháng
đó đã có ít nhất một giao dịch phát sinh.

**Tính toàn vẹn:** Báo cáo phải phản ánh đúng dữ liệu Snapshot từ các
phiếu sửa chữa cũ, không được thay đổi theo đơn giá hiện tại trong danh
mục.

4\. Sơ đồ use case

![](media/image6.png){width="6.5in" height="3.786111111111111in"}
