# Source
docs/QuanLyGargaOto/BaoCao_GARA_OTO.docx

# Conversion method
pandoc

**Huỳnh Lâm Vỹ - 227060038**

**Nguyễn Chí Nguyện -- 227060172**

**Quách Trường Phúc - 226060168**

**Lê Thành Đạt -- 227060036**

# **MỤC LỤC** {#mục-lục .TOC-Heading}

[**1.** **GIỚI THIỆU** [3](#_Toc224815264)](#_Toc224815264)

[**1.1.** **Mục đích:** [3](#_Toc224815265)](#_Toc224815265)

[**1.2.** **Phạm vi:** [3](#_Toc224815266)](#_Toc224815266)

[**2.** **ĐẶC TẢ YÊU CẦU** [3](#_Toc224815267)](#_Toc224815267)

[**2.1 Quản lý tiếp nhận và sửa chữa xe:**
[3](#_Toc224815268)](#_Toc224815268)

[**a.** **Tiếp nhận xe sửa chữa:** [3](#_Toc224815269)](#_Toc224815269)

[**b.** **Lập phiếu sửa chữa:** [4](#_Toc224815270)](#_Toc224815270)

[**2.2 Quản lý kho phụ tùng và vật tư:**
[4](#quản-lý-kho-phụ-tùng-và-vật-tư)](#quản-lý-kho-phụ-tùng-và-vật-tư)

[**2.3 Quản lý thu tiền và công nợ:**
[4](#quản-lý-thu-tiền-và-công-nợ)](#quản-lý-thu-tiền-và-công-nợ)

[**2.4 Quản lý báo cáo định kỳ:**
[5](#quản-lý-báo-cáo-định-kỳ)](#quản-lý-báo-cáo-định-kỳ)

[**3.** **MÔ HÌNH** [6](#_Toc224815274)](#_Toc224815274)

[**3.1 Sơ đồ hoạt vụ ( Use case diagram ):**
[6](#_Toc224815275)](#_Toc224815275)

[**3.1.1. Tổng quát** [6](#_Toc224815276)](#_Toc224815276)

[**3.1.2 Phân hệ Tiếp nhận:** [7](#_Toc224815277)](#_Toc224815277)

[**3.1.3. Phân hệ Lập phiếu sửa chữa:**
[8](#phân-hệ-lập-phiếu-sửa-chữa)](#phân-hệ-lập-phiếu-sửa-chữa)

[**3.1.4 Phân hệ Quản lý Kho & Vật tư:**
[8](#phân-hệ-quản-lý-kho-vật-tư)](#phân-hệ-quản-lý-kho-vật-tư)

[**3.1.5 Phân hệ Quản lý Thu tiền & Công nợ**
[9](#phân-hệ-quản-lý-thu-tiền-công-nợ)](#phân-hệ-quản-lý-thu-tiền-công-nợ)

[**3.1.6 Phân hệ Quản trị & Báo cáo**
[10](#phân-hệ-quản-trị-báo-cáo)](#phân-hệ-quản-trị-báo-cáo)

[**3.2 Sơ đồ gói (Packet diagram):**
[12](#sơ-đồ-gói-packet-diagram)](#sơ-đồ-gói-packet-diagram)

[**a. Tổng quát:** [12](#a.-tổng-quát)](#a.-tổng-quát)

[**b. Phân rã sơ đồ gói:**
[12](#b.-phân-rã-sơ-đồ-gói)](#b.-phân-rã-sơ-đồ-gói)

[**3.3 Sơ đồ lớp (Class diagram):**
[13](#sơ-đồ-lớp-class-diagram)](#sơ-đồ-lớp-class-diagram)

[**a. Sơ đồ:** [13](#a.-sơ-đồ)](#a.-sơ-đồ)

[**b. Phương thức:** [13](#b.-phương-thức)](#b.-phương-thức)

[**3.4 Sơ đồ tuần tự (Sequence diagram):**
[23](#sơ-đồ-tuần-tự-sequence-diagram)](#sơ-đồ-tuần-tự-sequence-diagram)

[**a. Lập phiếu sửa chữa:**
[23](#a.-lập-phiếu-sửa-chữa)](#a.-lập-phiếu-sửa-chữa)

[**b. Thu Tiền:** [24](#b.-thu-tiền)](#b.-thu-tiền)

[**c. Nhập kho:** [24](#c.-nhập-kho)](#c.-nhập-kho)

[**3.5 Sơ đồ hoạt động (Activity Diagram):**
[25](#sơ-đồ-hoạt-động-activity-diagram)](#sơ-đồ-hoạt-động-activity-diagram)

[**a. Lập phiếu sửa chữa:**
[25](#a.-lập-phiếu-sửa-chữa-1)](#a.-lập-phiếu-sửa-chữa-1)

[**b. Thu Tiền:** [26](#b.-thu-tiền-1)](#b.-thu-tiền-1)

[**c. Nhập kho:** [27](#c.-nhập-kho-1)](#c.-nhập-kho-1)

**\
**

**PHÂN TÍCH THIẾT KẾ PHẦN MỀM QUẢN LÝ GARA OTO**

1.  []{#_Toc224815264 .anchor}**GIỚI THIỆU**

    1.  []{#_Toc224815265 .anchor}**Mục đích:**

**-** Nhằm nâng cao hiệu quả công tác quản lý sửa chữa xe và tin học hoá
việc quản lý doanh thu, vật liệu tại Gara. Nhóm thực hiện việc phân tích
thiết kế phần mềm "Quản lý Gara Ô tô" với các mục tiêu cụ thể:

-   **Tối ưu hoá thời gian:** Rút ngắn quy trình tiếp nhận xe và lập
    phiếu sửa chữa.

-   **Chính xác trong tài chính:** Cung cấp thông tin công nợ khách hàng
    và doanh thu hàng tháng một cách minh bạch, kịp thời.

-   **Quản lý vật tư hiệu quả:** Theo dõi sát sao lượng tồn kho phụ
    tùng, hỗ trợ lập kế hoạch nhập hàng hợp lý.

-   **Nâng cao trải nghiệm khách hàng:** Lưu trữ lịch sử sửa chữa, giúp
    việc tra cứu thông tin xe và chủ xe trở nên nhanh chóng.

    1.  []{#_Toc224815266 .anchor}**Phạm vi:**

> Yêu cầu quản trị toàn bộ hoạt động của Gara từ khâu tiếp nhận xe, kiểm
> tra hỏng hóc, báo giá vật tư/tiền công cho đến khâu thanh toán và báo
> cáo định kỳ.

-   Cung cấp các biểu mẫu quản lý (Phiếu tiếp nhận, Phiếu sửa chữa,
    Phiếu thu tiền) theo đúng quy chuẩn nghiệp vụ.

-   Kết xuất các báo cáo doanh số và báo cáo tồn kho định kỳ hàng tháng
    cho chủ Gara.

2.  []{#_Toc224815267 .anchor}**ĐẶC TẢ YÊU CẦU**

[]{#_Toc224815268 .anchor}**2.1 Quản lý tiếp nhận và sửa chữa xe:**

a.  []{#_Toc224815269 .anchor}**Tiếp nhận xe sửa chữa:**

    -   **Mô tả:** Khi khách hàng mang xe đến, nhân viên Lễ tân thực
        hiện ghi nhận thông tin bao gồm: Biển số xe, Tên chủ xe, Hiệu
        xe, Điện thoại và Địa chỉ.

    -   **Logic hệ thống:** \* Hệ thống thực hiện tra cứu Biển số xe
        trong cơ sở dữ liệu:

> *\** Nếu xe đã từng sửa chữa: Hệ thống tự động truy xuất các thông tin
> cũ (Tên chủ xe, Địa chỉ\...) để tiết kiệm thời gian nhập liệu.
>
> \* Nếu là xe mới: Nhân viên tiến hành nhập mới toàn bộ thông tin.

-   Sau khi có thông tin xe, hệ thống thực hiện kiểm tra **Quy định 1**
    (Số xe tiếp nhận tối đa trong ngày):

    -   **Trường hợp vượt định mức:** Nếu số lượng xe đã tiếp nhận đạt
        mức 30 xe, hệ thống hiển thị thông báo: *\"Hệ thống đã tiếp nhận
        đủ xe trong ngày\"* và khóa chức năng tạo phiếu.

    -   **Trường hợp hợp lệ:** Hệ thống lưu thông tin vào bảng CARS và
        CUSTOMERS, đồng thời kết xuất **Phiếu tiếp nhận xe (BM1)**.

b.  []{#_Toc224815270 .anchor}**Lập phiếu sửa chữa:**

-   Cố vấn dịch vụ sẽ chọn xe từ danh sách xe đã tiếp nhận để tiến hành
    lập Phiếu sửa chữa (BM2).

-   Với mỗi nội dung hỏng hóc, nhân viên sẽ thực hiện chọn vật tư phụ
    tùng và tiền công tương ứng:

-   **Logic hệ thống:**

    -   **Kiểm tra tồn kho:** Khi chọn vật tư, hệ thống tự động đối
        chiếu số lượng yêu cầu với lượng tồn thực tế trong kho. Nếu
        thiếu hàng, hệ thống cảnh báo và yêu cầu điều chỉnh.

    -   **Lưu giá hiện hành (Snapshot):** Nếu đủ hàng, hệ thống tự động
        lấy đơn giá vật tư (từ bảng SUPPLIES) và đơn giá tiền công (từ
        bảng LABOR_FEES) để gán cứng vào chi tiết phiếu, nhằm tránh sai
        lệch doanh thu nếu bảng giá gốc thay đổi sau này.

    -   **Hệ thống tự động tính toán:** Thành tiền = (Số lượng \* Đơn
        giá phụ tùng) + Đơn giá tiền công.

<!-- -->

-   Sau khi lưu phiếu, hệ thống tự động cộng dồn tổng tiền vào cột
    *current_debt* (Tiền nợ hiện tại) trong hồ sơ xe của khách hàng.

## **2.2 Quản lý kho phụ tùng và vật tư:**

-   **Nhập kho phụ tùng:** Khi có hàng mới về, nhân viên Thủ kho tiến
    hành lập Phiếu nhập hàng, cập nhật số lượng tồn kho và đơn giá vốn.

-   **Tra cứu phụ tùng:** Hệ thống cho phép nhân viên xem danh sách phụ
    tùng, số lượng tồn thực tế để chủ động trong việc tư vấn sửa chữa.

-   **Tính toán tồn kho:** Cuối kỳ, hệ thống tổng hợp dữ liệu từ các
    Phiếu nhập và Phiếu sửa chữa để xác định số lượng tồn đầu và tồn
    cuối của từng loại phụ tùng.

## **2.3 Quản lý thu tiền và công nợ:**

-   **Mô tả:** Khi khách hàng đến nhận xe sau khi sửa, nhân viên Thu
    ngân sẽ thực hiện quy trình thanh toán và xoá nợ ( hoặc trừ nợ ) cho
    hồ sơ xe.

-   **Quy trình:**

    1.  **Truy xuất:** Nhân viên **nhập Biển số** xe để truy xuất thông
        tin. Hệ thống hiển thị các thông tin liên quan bao gồm: Tên chủ
        xe, Số điện thoại,... và đặc biệt là **Số tiền nợ hiện tại**
        *(current_debt)* được tổng hợp từ các phiếu sửa chữa trước đó.

    2.  **Lập phiếu thu (BM4):** Nhân viên nhập Số tiền khách đưa. Hệ
        thống tự động tính toán và hiển thị Số tiền thối lại cho khách
        hàng (Tiền thối = Số tiền khách đưa - Số tiền nợ).

    3.  **Kiểm tra Quy định 4**: Hệ thống xác định **Số tiền thực thu**
        (là số tiền thực tế trừ vào nợ).

        -   Nếu "*Số tiền thực thu*" \> "*Số tiền nợ*", hệ thống sẽ ngăn
            chặn thao tác lưu phiếu và hiển thị thông báo lỗi: "*Số tiền
            thu không được vượt quá số nợ của khách hàng".*

    4.  **Cập nhật dữ liệu:** Sau khi lưu phiếu thành công, hệ thống
        thực hiện:

        -   Ghi nhận giao dịch vào bảng **PAYMENTS.**

        -   Cập nhật lại số dư mới trong bảng **CARS:** *Số nợ mới = Số
            nợ cũ -- Số tiền thu ).*

        -   Kết xuất **Hóa đơn thanh toán** hiển thị đầy đủ các thông
            tin: Tổng nợ, Số tiền thực thu và Tiền thối lại.

## **2.4 Quản lý báo cáo định kỳ:**

-   **Báo cáo doanh số (BM5.1): \* Mục đích:** Theo dõi hiệu quả kinh
    doanh của Gara theo từng tháng.

    -   **Nội dung:** Hệ thống tổng hợp dữ liệu để thống kê số lượt sửa
        chữa, tổng doanh thu và tỷ lệ (%) đóng góp của từng Hiệu xe
        (Toyota, Honda, Kia\...).

-   **Báo cáo tồn kho (BM5.2): \* Mục đích:** Kiểm soát lượng vật tư
    biến động trong kỳ để có kế hoạch nhập hàng.

    -   **Nội dung**: Thống kê chi tiết cho từng loại phụ tùng bao gồm:
        Tồn đầu tháng, Số lượng nhập mới, Số lượng xuất (để sửa chữa) và
        Tồn cuối tháng.

3.  []{#_Toc224815274 .anchor}**MÔ HÌNH**

[]{#_Toc224815275 .anchor}**3.1 Sơ đồ hoạt vụ ( Use case diagram ):**

[]{#_Toc224815276 .anchor}**3.1.1. Tổng quát**

![](media/image1.png){width="6.740972222222222in"
height="3.9784722222222224in"}

> []{#_Toc224815277 .anchor}**3.1.2 Phân hệ Tiếp nhận:**

a.  **Đặc tả chi tiết:**

-   **Tác nhân**: Nhân viên Lễ tân

-   **Mô tả:** Ghi nhận thông tin xe vào xưởng và kiểm tra định mức tiếp
    nhận tối đa trong ngày (\<=30 xe /ngày).

-   **Tiền điều kiện**: Nhân viên đã đăng nhập vào hệ thống.

-   **Luồng sự kiện chính:**

1.  Lễ tân chọn chức năng \"Tiếp nhận xe\".

2.  Hệ thống tự động kiểm tra số lượng xe đã nhận trong ngày.

    a.  Nếu số lượng xe \> 30: Hệ thống sẽ thông báo "*Đã tiếp nhận đủ
        số lượng xe trong ngày*" và không cho tao phiếu tiếp nhận xe.

3.  Lễ tân nhập biển số xe để tra cứu thông tin.

4.  Hệ thống hiển thị thông tin cũ (nếu có) hoặc cho phép nhập mới hoàn
    toàn.

5.  Lễ tân nhấn \"Lưu phiếu\", hệ thống ghi dữ liệu vào bảng CARS,
    CUSTOMERS và kết xuất Phiếu tiếp nhận (BM1).

-   **Hậu điều kiện:** Xe mới được ghi nhận vào danh sách chờ sửa chữa.

#### **b. Sơ đồ phân rã:**

![](media/image2.png){width="6.740972222222222in" height="3.8625in"}

**\
**

### **3.1.3. Phân hệ Lập phiếu sửa chữa:** 

#### **a. Đặc tả chi tiết:** 

-   **Tác nhân:** Cố vấn dịch vụ

-   **Mô tả:** Lập danh sách các hạng mục hỏng hóc, vật tư thay thế và
    tiền công tương ứng.

-   **Tiền điều kiện:** Xe đã được Lễ tân tiếp nhận vào xưởng.

-   **Luồng sự kiện chính:**

1.  Cố vấn dịch vụ chọn xe từ danh sách xe đang chờ sửa chữa

2.  Cố vấn thêm nội dung công việc. Khi chọn Vật tư phụ tùng, hệ thống
    bắt buộc thực hiện **Kiểm tra tồn kho**.

3.  Nếu số lượng tồn kho hợp lệ (Đủ hàng), hệ thống tự động điền đơn giá
    vật tư và tiền công hiện tại.

4.  Hệ thống thực hiện **Lưu giá hiện hành (Snapshot)** vào chi tiết
    phiếu để tránh sai lệch báo cáo sau này (Theo QĐ2).

5.  Hệ thống tự động tính tổng thành tiền của phiếu.

6.  Cố vấn nhấn \"Lưu phiếu\", hệ thống tự động **Cập nhật công nợ**
    (cộng dồn số tiền vào current_debt của khách hàng).

-   **Luồng ngoại lệ:**

    -   Tại bước 2 (Thiếu vật tư): Hệ thống phát hiện số lượng tồn kho
        \< số lượng yêu cầu.

        -   Hệ thống hiển thị cảnh báo: *\"Phụ tùng trong kho không
            đủ\"*.

        -   Cố vấn dịch vụ phải giảm số lượng hoặc chọn loại vật tư
            khác.

#### **b. Sơ đồ phân rã:** 

> ![](media/image3.png){width="6.740972222222222in"
> height="2.8305555555555557in"}

### **3.1.4 Phân hệ Quản lý Kho & Vật tư:**

#### **a. Đặc tả chi tiết:** 

-   **Use Case:** Nhập kho phụ tùng

    -   **Tác nhân:** Thủ kho.

    -   **Mô tả:** Ghi nhận vật tư mới nhập xưởng để cập nhật giá vốn và
        số lượng.

    -   **Logic:** Hệ thống thực hiện Cập nhật số lượng tồn, tự động
        cộng dồn số lượng thực nhập vào cột *stock_qty* trong bảng
        *SUPPLIES*.

-   **Use Case:** Tra cứu phụ tùng

    -   **Tác nhân:** Thủ kho, Cố vấn dịch vụ.

    -   **Mô tả:** Cho phép xem danh sách phụ tùng, đơn giá niêm yết và
        số lượng tồn hiện tại để chủ động trong việc sửa chữa.

-   **Use Case:** Tính toán tồn kho

    -   **Tác nhân:** Thủ kho.

    -   **Mô tả:** Cuối kỳ, hệ thống quét dữ liệu từ các Phiếu nhập và
        Phiếu sửa chữa (đã xuất vật tư) để tính toán số dư.

    -   **Logic:** Thực hiện **Kết xuất Báo cáo tồn kho (BM5.2)** hiển
        thị các thông tin: Tồn đầu, Nhập, Xuất và Tồn cuối của từng loại
        vật tư.

    a.  **Sơ đồ phân rã:**

> ![](media/image4.png){width="6.740972222222222in"
> height="3.5805555555555557in"}

### **3.1.5 Phân hệ Quản lý Thu tiền & Công nợ**

#### **a. Đặc tả chi tiết:**

-   **Use Case: Lập phiếu thu tiền**

    -   **Tác nhân:** Thu ngân.

    -   **Mô tả:** Thực hiện ghi nhận số tiền khách thanh toán để trừ
        vào công nợ của xe.

    -   **Tiền điều kiện**: Xe đã được lập phiếu sửa chữa và có phát
        sinh nợ (current_debt \> 0).

    -   **Luồng sự kiện chính:**

        1.  Thu ngân nhập biển số xe để truy xuất thông tin nợ.

        2.  Hệ thống thực hiện **Truy xuất nợ cũ**, hiển thị số tiền
            khách đang nợ.

        3.  Thu ngân nhập số tiền khách muốn trả.

        4.  Hệ thống thực hiện **Kiểm tra Quy định 4**: Nếu số tiền thu
            lớn hơn số tiền đang nợ, hệ thống sẽ báo lỗi và ngăn chặn
            việc lưu phiếu.

        5.  Nếu hợp lệ, Thu ngân nhấn \"Lưu phiếu\".

<!-- -->

-   **Hậu điều kiện:** Số nợ của khách được cập nhật giảm xuống.

-   **Use Case: Cập nhật số dư nợ mới**

-   **Mô tả:** Hệ thống tự động tính toán lại: Nợ mới = Nợ cũ - Số tiền
    thực thu và cập nhật vào bảng CARS.

-   **Use Case: In hóa đơn thanh toán**

-   **Mô tả**: Kết xuất ra biểu mẫu (BM4) hiển thị tổng nợ, số tiền đã
    thu và số nợ còn lại (nếu có) để giao cho khách hàng.

#### **b.Sơ đồ phân rã:** 

![](media/image5.png){width="6.740972222222222in"
height="3.1277777777777778in"}

### **3.1.6 Phân hệ Quản trị & Báo cáo**

#### **a. Đặc tả chi tiết:**

-   **Use Case: Báo cáo doanh số (BM5.1)**

    -   **Tác nhân:** Quản trị viên.

    -   **Mô tả:** Hệ thống tổng hợp dữ liệu từ các phiếu thu trong
        tháng để thống kê doanh thu theo từng hiệu xe.

    -   **Logic:** Tính toán số lượt sửa chữa và tỉ lệ doanh thu (%) của
        từng hiệu xe (Toyota, Honda, Kia\...) để xuất biểu mẫu BM5.1.

<!-- -->

-   **Use Case: Báo cáo tồn kho (BM5.2)**

    -   **Tác nhân:** Quản trị viên (hoặc Thủ kho có quyền xem).

    -   **Mô tả:** Thống kê lượng phụ tùng biến động trong tháng.

    -   **Logic:** Tổng hợp từ phiếu nhập và phiếu sửa chữa để xác định:
        Tồn đầu, Nhập, Xuất, Tồn cuối.

-   **Use Case: Thay đổi quy định (QĐ6)**

    -   **Tác nhân:** Quản trị viên.

    -   **Mô tả:** Cho phép cập nhật các tham số hệ thống mà không cần
        sửa code.

    -   **Nội dung:** Thay đổi số xe tiếp nhận tối đa (QĐ1), đơn giá
        tiền công mới, hoặc thay đổi tỉ lệ đơn giá bán so với giá vốn.

#### **b. Sơ đồ phân rã:**

![](media/image6.png){width="6.740972222222222in"
height="3.6840277777777777in"}

## **3.2 Sơ đồ gói (Packet diagram):**

## **a. Tổng quát:**

![](media/image7.png){width="6.740972222222222in"
height="3.767361111111111in"}

### **b. Phân rã sơ đồ gói:**

![](media/image8.png){width="5.258333333333334in"
height="3.9002788713910763in"}

## **3.3 Sơ đồ lớp (Class diagram):**

### **a. Sơ đồ:**

![](media/image9.png){width="6.740972222222222in"
height="4.374305555555556in"}

### **b. Phương thức:**

1\. Bảng KHACH_HANG

  ----------------------------------------------------------------------------------------------------------------------------------------------------
  **STT**   **Tên thuộc **Kiểu**   **Kích    **Số chữ **Miền   **Trị mặc   **Min**   **Max**   **Khóa    **Duy    **Not    **Ràng   **Ràng    **Diễn
            tính**                 thước**   số thập  giá      nhiên**                         chính**   nhất**   Null**   buộc     buộc toàn giải**
                                             phân**   trị**                                                                toàn vẹn vẹn khóa  
                                                                                                                           luận     ngoài**   
                                                                                                                           lý**               
  --------- ----------- ---------- --------- -------- -------- ----------- --------- --------- --------- -------- -------- -------- --------- --------
  1         MaKH        Int        4         0        Số       Auto        1         ∞         x         x        x        MaKH \>            Mã khách
                                                      nguyên   Increment                                                   0                  hàng
                                                      dương                                                                                   

  2         TenChuXe    Nvarchar   50        0        Chuỗi ký                                                    x        Không              Tên chủ
                                                      tự                                                                   rỗng               xe

  3         DienThoai   Varchar    15        0        Số điện              10 số     15 số                        x        Đúng               Số điện
                                                      thoại                                                                định               thoại
                                                      hợp lệ                                                               dạng số            khách
                                                                                                                           điện               hàng
                                                                                                                           thoại              

  4         DiaChi      Nvarchar   100       0        Chuỗi ký                                                    x        Không              Địa chỉ
                                                      tự                                                                   rỗng               khách
                                                                                                                                              hàng
  ----------------------------------------------------------------------------------------------------------------------------------------------------

2\. Bảng HIEU_XE

  ------------------------------------------------------------------------------------------------------------------------------------------------------
  **STT**   **Tên thuộc **Kiểu**   **Kích    **Số chữ **Miền   **Trị mặc   **Min**   **Max**   **Khóa    **Duy    **Not    **Ràng     **Ràng    **Diễn
            tính**                 thước**   số thập  giá      nhiên**                         chính**   nhất**   Null**   buộc toàn  buộc toàn giải**
                                             phân**   trị**                                                                vẹn luận   vẹn khóa  
                                                                                                                           lý**       ngoài**   
  --------- ----------- ---------- --------- -------- -------- ----------- --------- --------- --------- -------- -------- ---------- --------- --------
  1         MaHieuXe    Int        4         0        Số       Auto        1         ∞         x         x        x        MaHieuXe             Mã hiệu
                                                      nguyên   Increment                                                   \> 0                 xe
                                                      dương                                                                                     

  2         TenHieuXe   Nvarchar   30        0        Chuỗi ký                                           x        x        Không rỗng           Tên hiệu
                                                      tự                                                                                        xe
  ------------------------------------------------------------------------------------------------------------------------------------------------------

3\. Bảng XE

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------
  **STT**   **Tên thuộc     **Kiểu**   **Kích    **Số chữ **Miền   **Trị mặc   **Min**   **Max**   **Khóa    **Duy    **Not    **Ràng buộc     **Ràng    **Diễn
            tính**                     thước**   số thập  giá      nhiên**                         chính**   nhất**   Null**   toàn vẹn luận   buộc toàn giải**
                                                 phân**   trị**                                                                lý**            vẹn khóa  
                                                                                                                                               ngoài**   
  --------- --------------- ---------- --------- -------- -------- ----------- --------- --------- --------- -------- -------- --------------- --------- --------
  1         MaXe            Int        4         0        Số       Auto        1         ∞         x         x        x        MaXe \> 0                 Mã xe
                                                          nguyên   Increment                                                                             
                                                          dương                                                                                          

  2         BienSo          Varchar    15        0        Biển số                                            x        x        Đúng định dạng            Biển số
                                                          hợp lệ                                                               biển số                   xe

  3         MaHieuXe        Int        4         0        Số                   1         ∞                            x        Phải tồn tại    x         Mã hiệu
                                                          nguyên                                                               trong HIEU_XE             xe
                                                          dương                                                                                          

  4         MaKH            Int        4         0        Số                   1         ∞                            x        Phải tồn tại    x         Mã khách
                                                          nguyên                                                               trong                     hàng
                                                          dương                                                                KHACH_HANG                

  5         TienNoHienTai   Decimal    12        2        Số không 0           0         ∞                            x        TienNoHienTai ≥           Số tiền
                                                          âm                                                                   0                         khách
                                                                                                                                                         còn nợ
  ---------------------------------------------------------------------------------------------------------------------------------------------------------------

4.  Bảng PHIEU_SUA_CHUA

  -----------------------------------------------------------------------------------------------------------------------------------------------------------
  **STT**   **Tên thuộc **Kiểu**   **Kích    **Số chữ **Miền giá   **Trị mặc   **Min**   **Max**   **Khóa    **Duy    **Not    **Ràng buộc **Ràng    **Diễn
            tính**                 thước**   số thập  trị**        nhiên**                         chính**   nhất**   Null**   toàn vẹn    buộc toàn giải**
                                             phân**                                                                            luận lý**   vẹn khóa  
                                                                                                                                           ngoài**   
  --------- ----------- ---------- --------- -------- ------------ ----------- --------- --------- --------- -------- -------- ----------- --------- --------
  1         MaPhieuSC   Int        4         0        Số nguyên    Auto        1         ∞         x         x        x        MaPhieuSC             Mã phiếu
                                                      dương        Increment                                                   \> 0                  sửa chữa

  2         MaXe        Int        4         0        Số nguyên                1         ∞                            x        Phải tồn    x         Mã xe
                                                      dương                                                                    tại trong             được sửa
                                                                                                                               XE                    chữa

  3         NgaySC      Date                 0        Ngày hợp lệ  Current                                            x        Không lớn             Ngày lập
                                                                   Date                                                        hơn ngày              phiếu
                                                                                                                               hiện tại              sửa chữa

  4         TrangThai   Nvarchar   20        0        {TiepNhan,   TiepNhan                                           x        Thuộc tập             Trạng
                                                      DangSua,                                                                 trạng thái            thái
                                                      HoanTat}                                                                 cho phép              phiếu
                                                                                                                                                     sửa chữa

  5         TongTien    Decimal    12        2        Số không âm  0           0         ∞                            x        TongTien ≥            Tổng
                                                                                                                               0                     tiền
                                                                                                                                                     phiếu
                                                                                                                                                     sửa chữa
  -----------------------------------------------------------------------------------------------------------------------------------------------------------

5\. Bảng TIEN_CONG

  ---------------------------------------------------------------------------------------------------------------------------------------------------------
  **STT**   **Tên thuộc  **Kiểu**   **Kích    **Số chữ **Miền   **Trị mặc   **Min**   **Max**   **Khóa    **Duy    **Not    **Ràng buộc  **Ràng    **Diễn
            tính**                  thước**   số thập  giá      nhiên**                         chính**   nhất**   Null**   toàn vẹn     buộc toàn giải**
                                              phân**   trị**                                                                luận lý**    vẹn khóa  
                                                                                                                                         ngoài**   
  --------- ------------ ---------- --------- -------- -------- ----------- --------- --------- --------- -------- -------- ------------ --------- --------
  1         MaTienCong   Int        4         0        Số       Auto        1         ∞         x         x        x        MaTienCong             Mã tiền
                                                       nguyên   Increment                                                   \> 0                   công
                                                       dương                                                                                       

  2         NoiDung      Nvarchar   100       0        Chuỗi ký                                           x        x        Không rỗng             Nội dung
                                                       tự                                                                                          công
                                                                                                                                                   việc sửa
                                                                                                                                                   chữa

  3         DonGia       Decimal    12        2        Số dương 0           0         ∞                            x        DonGia ≥ 0             Đơn giá
                                                                                                                                                   tiền
                                                                                                                                                   công
  ---------------------------------------------------------------------------------------------------------------------------------------------------------

6\. Bảng VAT_TU

  ---------------------------------------------------------------------------------------------------------------------------------------------------------
  **STT**   **Tên thuộc  **Kiểu**   **Kích    **Số chữ **Miền   **Trị mặc   **Min**   **Max**   **Khóa    **Duy    **Not    **Ràng buộc  **Ràng    **Diễn
            tính**                  thước**   số thập  giá      nhiên**                         chính**   nhất**   Null**   toàn vẹn     buộc toàn giải**
                                              phân**   trị**                                                                luận lý**    vẹn khóa  
                                                                                                                                         ngoài**   
  --------- ------------ ---------- --------- -------- -------- ----------- --------- --------- --------- -------- -------- ------------ --------- --------
  1         MaVatTu      Int        4         0        Số       Auto        1         ∞         x         x        x        MaVatTu \> 0           Mã vật
                                                       nguyên   Increment                                                                          tư
                                                       dương                                                                                       

  2         TenVatTu     Nvarchar   50        0        Chuỗi ký                                           x        x        Không rỗng             Tên vật
                                                       tự                                                                                          tư

  3         DonViTinh    Nvarchar   20        0        Chuỗi ký                                                    x        Không rỗng             Đơn vị
                                                       tự                                                                                          tính

  4         SoLuongTon   Int        4         0        Số       0           0         ∞                            x        SoLuongTon ≥           Số lượng
                                                       nguyên                                                               0                      tồn kho
                                                       không âm                                                                                    

  5         GiaVon       Decimal    12        2        Số không 0           0         ∞                            x        GiaVon ≥ 0             Giá nhập
                                                       âm                                                                                          

  6         DonGiaBan    Decimal    12        2        Số không 0           0         ∞                            x        DonGiaBan ≥            Giá bán
                                                       âm                                                                   0                      vật tư
  ---------------------------------------------------------------------------------------------------------------------------------------------------------

7\. Bảng CT_PHIEU_SUA_CHUA

  -----------------------------------------------------------------------------------------------------------------------------------------------------------------
  **STT**   **Tên thuộc      **Kiểu**   **Kích    **Số chữ **Miền   **Trị mặc   **Min**   **Max**   **Khóa    **Duy    **Not    **Ràng buộc toàn **Ràng    **Diễn
            tính**                      thước**   số thập  giá      nhiên**                         chính**   nhất**   Null**   vẹn luận lý**    buộc toàn giải**
                                                  phân**   trị**                                                                                 vẹn khóa  
                                                                                                                                                 ngoài**   
  --------- ---------------- ---------- --------- -------- -------- ----------- --------- --------- --------- -------- -------- ---------------- --------- --------
  1         MaCTSC           Int        4         0        Số       Auto        1         ∞         x         x        x        MaCTSC \> 0                Mã chi
                                                           nguyên   Increment                                                                              tiết
                                                           dương                                                                                           phiếu
                                                                                                                                                           sửa chữa

  2         MaPhieuSC        Int        4         0        Số                   1         ∞                            x        Phải tồn tại     x         Mã phiếu
                                                           nguyên                                                               trong                      sửa chữa
                                                           dương                                                                PHIEU_SUA_CHUA             

  3         MaVatTu          Int        4         0        Số                   1         ∞                            x        Phải tồn tại     x         Mã vật
                                                           nguyên                                                               trong VAT_TU               tư
                                                           dương                                                                                           

  4         MaTienCong       Int        4         0        Số                   1         ∞                            x        Phải tồn tại     x         Mã tiền
                                                           nguyên                                                               trong TIEN_CONG            công
                                                           dương                                                                                           

  5         SoLuong          Int        4         0        Số       1           1         ∞                            x        SoLuong ≥ 1                Số lượng
                                                           nguyên                                                                                          vật tư
                                                           dương                                                                                           sử dụng

  6         DonGiaVatTu      Decimal    12        2        Số không 0           0         ∞                            x        DonGiaVatTu ≥ 0            Đơn giá
                                                           âm                                                                                              vật tư
                                                                                                                                                           tại thời
                                                                                                                                                           điểm sửa

  7         DonGiaTienCong   Decimal    12        2        Số không 0           0         ∞                            x        DonGiaTienCong ≥           Đơn giá
                                                           âm                                                                   0                          tiền
                                                                                                                                                           công tại
                                                                                                                                                           thời
                                                                                                                                                           điểm sửa

  8         ThanhTien        Decimal    12        2        Số không 0           0         ∞                            x        ThanhTien =                Thành
                                                           âm                                                                   SoLuong \*                 tiền của
                                                                                                                                DonGiaVatTu +              dòng chi
                                                                                                                                DonGiaTienCong             tiết
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------

8\. Bảng NHA_CUNG_CAP

  ----------------------------------------------------------------------------------------------------------------------------------------------------
  **STT**   **Tên thuộc **Kiểu**   **Kích    **Số chữ **Miền   **Trị mặc   **Min**   **Max**   **Khóa    **Duy    **Not    **Ràng   **Ràng    **Diễn
            tính**                 thước**   số thập  giá      nhiên**                         chính**   nhất**   Null**   buộc     buộc toàn giải**
                                             phân**   trị**                                                                toàn vẹn vẹn khóa  
                                                                                                                           luận     ngoài**   
                                                                                                                           lý**               
  --------- ----------- ---------- --------- -------- -------- ----------- --------- --------- --------- -------- -------- -------- --------- --------
  1         MaNCC       Int        4         0        Số       Auto        1         ∞         x         x        x        MaNCC \>           Mã nhà
                                                      nguyên   Increment                                                   0                  cung cấp
                                                      dương                                                                                   

  2         TenNCC      Nvarchar   50        0        Chuỗi ký                                           x        x        Không              Tên nhà
                                                      tự                                                                   rỗng               cung cấp

  3         DienThoai   Varchar    15        0        Số điện              10 số     15 số                        x        Đúng               Số điện
                                                      thoại                                                                định               thoại
                                                      hợp lệ                                                               dạng số            nhà cung
                                                                                                                           điện               cấp
                                                                                                                           thoại              

  4         DiaChi      Nvarchar   100       0        Chuỗi ký                                                    x        Không              Địa chỉ
                                                      tự                                                                   rỗng               nhà cung
                                                                                                                                              cấp
  ----------------------------------------------------------------------------------------------------------------------------------------------------

9\. Bảng PHIEU_NHAP_KHO

  ------------------------------------------------------------------------------------------------------------------------------------------------------------
  **STT**   **Tên thuộc   **Kiểu**   **Kích    **Số chữ **Miền   **Trị mặc   **Min**   **Max**   **Khóa    **Duy    **Not    **Ràng buộc    **Ràng    **Diễn
            tính**                   thước**   số thập  giá      nhiên**                         chính**   nhất**   Null**   toàn vẹn luận  buộc toàn giải**
                                               phân**   trị**                                                                lý**           vẹn khóa  
                                                                                                                                            ngoài**   
  --------- ------------- ---------- --------- -------- -------- ----------- --------- --------- --------- -------- -------- -------------- --------- --------
  1         MaPhieuNhap   Int        4         0        Số       Auto        1         ∞         x         x        x        MaPhieuNhap \>           Mã phiếu
                                                        nguyên   Increment                                                   0                        nhập kho
                                                        dương                                                                                         

  2         MaNCC         Int        4         0        Số                   1         ∞                            x        Phải tồn tại   x         Mã nhà
                                                        nguyên                                                               trong                    cung cấp
                                                        dương                                                                NHA_CUNG_CAP             

  3         NgayNhap      Date                 0        Ngày hợp Current                                            x        Không lớn hơn            Ngày
                                                        lệ       Date                                                        ngày hiện tại            nhập kho

  4         TongTien      Decimal    12        2        Số không 0           0         ∞                            x        TongTien ≥ 0             Tổng
                                                        âm                                                                                            tiền
                                                                                                                                                      phiếu
                                                                                                                                                      nhập
  ------------------------------------------------------------------------------------------------------------------------------------------------------------

10\. Bảng CT_PHIEU_NHAP

  --------------------------------------------------------------------------------------------------------------------------------------------------------------
  **STT**   **Tên thuộc   **Kiểu**   **Kích    **Số chữ **Miền   **Trị mặc   **Min**   **Max**   **Khóa    **Duy    **Not    **Ràng buộc toàn **Ràng    **Diễn
            tính**                   thước**   số thập  giá      nhiên**                         chính**   nhất**   Null**   vẹn luận lý**    buộc toàn giải**
                                               phân**   trị**                                                                                 vẹn khóa  
                                                                                                                                              ngoài**   
  --------- ------------- ---------- --------- -------- -------- ----------- --------- --------- --------- -------- -------- ---------------- --------- --------
  1         MaCTPN        Int        4         0        Số       Auto        1         ∞         x         x        x        MaCTPN \> 0                Mã chi
                                                        nguyên   Increment                                                                              tiết
                                                        dương                                                                                           phiếu
                                                                                                                                                        nhập

  2         MaPhieuNhap   Int        4         0        Số                   1         ∞                            x        Phải tồn tại     x         Mã phiếu
                                                        nguyên                                                               trong                      nhập kho
                                                        dương                                                                PHIEU_NHAP_KHO             

  3         MaVatTu       Int        4         0        Số                   1         ∞                            x        Phải tồn tại     x         Mã vật
                                                        nguyên                                                               trong VAT_TU               tư
                                                        dương                                                                                           

  4         SoLuong       Int        4         0        Số       1           1         ∞                            x        SoLuong ≥ 1                Số lượng
                                                        nguyên                                                                                          nhập
                                                        dương                                                                                           

  5         DonGiaNhap    Decimal    12        2        Số không 0           0         ∞                            x        DonGiaNhap ≥ 0             Đơn giá
                                                        âm                                                                                              nhập

  6         ThanhTien     Decimal    12        2        Số không 0           0         ∞                            x        ThanhTien =                Thành
                                                        âm                                                                   SoLuong \*                 tiền
                                                                                                                             DonGiaNhap                 dòng
                                                                                                                                                        nhập
  --------------------------------------------------------------------------------------------------------------------------------------------------------------

11\. Bảng PHIEU_THU_TIEN

  ------------------------------------------------------------------------------------------------------------------------------------------------------------
  **STT**   **Tên thuộc  **Kiểu**   **Kích    **Số chữ **Miền   **Trị mặc   **Min**   **Max**   **Khóa    **Duy    **Not    **Ràng buộc     **Ràng    **Diễn
            tính**                  thước**   số thập  giá      nhiên**                         chính**   nhất**   Null**   toàn vẹn luận   buộc toàn giải**
                                              phân**   trị**                                                                lý**            vẹn khóa  
                                                                                                                                            ngoài**   
  --------- ------------ ---------- --------- -------- -------- ----------- --------- --------- --------- -------- -------- --------------- --------- --------
  1         MaPhieuThu   Int        4         0        Số       Auto        1         ∞         x         x        x        MaPhieuThu \> 0           Mã phiếu
                                                       nguyên   Increment                                                                             thu tiền
                                                       dương                                                                                          

  2         MaXe         Int        4         0        Số                   1         ∞                            x        Phải tồn tại    x         Mã xe
                                                       nguyên                                                               trong XE                  thanh
                                                       dương                                                                                          toán

  3         NgayThu      Date                 0        Ngày hợp Current                                            x        Không lớn hơn             Ngày thu
                                                       lệ       Date                                                        ngày hiện tại             tiền

  4         SoTienThu    Decimal    12        2        Số dương 0           0         ∞                            x        SoTienThu \> 0            Số tiền
                                                                                                                            và SoTienThu ≤            khách
                                                                                                                            TienNoHienTai             thanh
                                                                                                                                                      toán

  5         GhiChu       Nvarchar   100       0        Chuỗi ký                                                                                       Ghi chú
                                                       tự                                                                                             thanh
                                                                                                                                                      toán
  ------------------------------------------------------------------------------------------------------------------------------------------------------------

12\. Bảng QUY_DINH

  --------------------------------------------------------------------------------------------------------------------------------------------------------
  **STT**   **Tên thuộc  **Kiểu**   **Kích    **Số chữ **Miền   **Trị mặc   **Min**   **Max**   **Khóa    **Duy    **Not    **Ràng buộc **Ràng    **Diễn
            tính**                  thước**   số thập  giá      nhiên**                         chính**   nhất**   Null**   toàn vẹn    buộc toàn giải**
                                              phân**   trị**                                                                luận lý**   vẹn khóa  
                                                                                                                                        ngoài**   
  --------- ------------ ---------- --------- -------- -------- ----------- --------- --------- --------- -------- -------- ----------- --------- --------
  1         MaQuyDinh    Int        4         0        Số       Auto        1         ∞         x         x        x        MaQuyDinh             Mã quy
                                                       nguyên   Increment                                                   \> 0                  định
                                                       dương                                                                                      

  2         TenQuyDinh   Nvarchar   50        0        Chuỗi ký                                           x        x        Không rỗng            Tên quy
                                                       tự                                                                                         định

  3         GiaTri       Decimal    12        2        Số không 0           0         ∞                            x        GiaTri ≥ 0            Giá trị
                                                       âm                                                                                         quy định

  4         MoTa         Nvarchar   100       0        Chuỗi ký                                                                                   Mô tả
                                                       tự                                                                                         quy định
  --------------------------------------------------------------------------------------------------------------------------------------------------------

## **3.4 Sơ đồ tuần tự (Sequence diagram):**

### **a. Lập phiếu sửa chữa:**

![](media/image10.png){width="7.570138888888889in"
height="4.866666666666666in"}

### **b. Thu Tiền:**

![](media/image11.png){width="7.166666666666667in"
height="4.158837489063867in"}

### **c. Nhập kho:** 

![](media/image12.png){width="6.740972222222222in"
height="3.9402777777777778in"}

## **3.5 Sơ đồ hoạt động (Activity Diagram):**

### **a. Lập phiếu sửa chữa:**

![](media/image13.png){width="6.6932502187226595in"
height="7.791666666666667in"}

### **b. Thu Tiền:**

![](media/image14.png){width="6.740972222222222in"
height="7.409027777777778in"}

###  **c. Nhập kho:**

![](media/image15.png){width="3.3833333333333333in"
height="8.500633202099738in"}
