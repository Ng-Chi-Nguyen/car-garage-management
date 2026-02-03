# Quy định Đóng góp (CONTRIBUTING)

Chào mừng các bạn đến với dự án **Quản Lý Gara Ô Tô**. Tài liệu này hướng dẫn cách làm việc chung cho cả nhóm để code thống nhất, ít lỗi và dễ đọc.

---

## 1. Quy trình làm việc (Workflow)

Chúng ta sẽ làm việc trên **Github** theo quy trình đơn giản sau:

1.  **Nhánh `main`**: Chứa code ổn định nhất. **KHÔNG** được code trực tiếp hay push thẳng lên nhánh này.
2.  **Tạo nhánh mới**: Khi bắt đầu làm một chức năng mới hoặc sửa lỗi, hãy tạo nhánh từ `main`.
    - Đặt tên nhánh: `loại/ten-ngan-gon-khong-dau`
    - Ví dụ:
      - Làm chức năng đăng nhập: `feat/dang-nhap`
      - Sửa lỗi tính tiền: `fix/loi-tinh-tien`
      - Cập nhật tài liệu: `docs/cap-nhat-readme`

**Các bước cụ thể:**

1.  `git checkout main` (Về nhánh chính)
2.  `git pull origin main` (Cập nhật code mới nhất từ server)
3.  `git checkout -b feat/ten-chuc-nang` (Tạo và chuyển sang nhánh mới)
4.  Code và Commit...
5.  `git push origin feat/ten-chuc-nang` (Đẩy nhánh lên Github)
6.  Lên Github tạo **Pull Request (PR)** vào nhánh `main`.
7.  Nhờ một bạn khác trong nhóm review (xem qua) và Approve.
8.  Merge vào `main`.

---

## 2. Quy tắc Commit (Commit Message)

- **Ngôn ngữ**: Khuyến khích dùng **Tiếng Việt** cho dễ hiểu (hoặc Tiếng Anh nếu muốn).
- **Cấu trúc**: `Loại: Mô tả ngắn gọn nội dung`

**Các loại commit (Type):**

- `feat`: Thêm tính năng mới (Feature).
- `fix`: Sửa lỗi (Bug fix).
- `ui`: Chỉnh sửa giao diện (CSS, HTML...).
- `docs`: Viết/sửa tài liệu.
- `refactor`: Sửa lại code cho gọn/đẹp hơn (không đổi tính năng).
- `chore`: Các việc linh tinh (cài thêm thư viện, setup...).

**Ví dụ:**

- `feat: thêm chức năng tiếp nhận xe`
- `fix: sửa lỗi không lưu được tiền công`
- `ui: chỉnh màu nút bấm cho đẹp hơn`
- `docs: cập nhật hướng dẫn cài đặt`

---

## 3. Quy định về Code (Coding Conventions)

### 3.1. Quy định về đặt tên

- Biến Boolean: Bắt đầu bằng `is`.
  - Ví dụ: `isActive`, `isChecked`.
- Hàm handler: `handle` + `TênTrường` + `HànhĐộng`.
  - Ví dụ: `handleStatusChange`.
- Hằng số (Constants): Viết HOA toàn bộ và dùng dấu gạch dưới.
  - Ví dụ: `MAX_COUNT`, `BASE_URL`.
- Component: Luôn dùng PascalCase (viết hoa chữ cái đầu mỗi từ).
  - Ví dụ: `UserProfile.jsx`, `ButtonPrimary.jsx`.

### 3.2. Cấu trúc tệp tin

- Thứ tự imports: Core -> Libs -> Components -> Hooks -> API -> Utils.
- Giới hạn độ dài file:
  - File “thường”: tối đa 200 dòng.
  - File “component”: tối đa 300 dòng.
  - Nếu vượt quá giới hạn, bắt buộc tách nhỏ.
- Hàm: Tất cả dùng arrow function với `const`.
  - File chỉ export 1 hàm/component: dùng `export default`
  - File export nhiều hàm: dùng `export { tenHamA, tenHamB }`
    Ví dụ:

```jsx
// imports: Core -> Libs -> Components -> Hooks -> API -> Utils
import React from "react";
import dayjs from "dayjs";
// components
import ButtonPrimary from "@/components/ButtonPrimary";
// hooks
import { useUsers } from "@/hooks/useUsers";
// api
import { userApi } from "@/api/userApi";
// utils
import { formatCurrency } from "@/utils/formatters";

const UserList = () => {
  return <></>;
};

export default UserList;
```

### 3.3. Xử lý Form & Dữ liệu

- Backend: với dữ liệu số nhiều, luôn trả về dạng phân trang (ví dụ: `items`, `pagination`).
- Giao thức Form: Bắt buộc dùng thẻ `<form onSubmit={handleSubmit}>` để hỗ trợ phím Enter.
- Ép kiểu an toàn: Luôn dùng `Number()` cho tiền tệ, số lượng, hoặc ID trước khi gửi để tránh `NaN` và lỗi xác thực (Joi).
- Điều hướng: Ưu tiên dùng đường dẫn tuyệt đối (VD: `/management/users`) thay vì `navigate(-1)` để đảm bảo React Router kích hoạt lại Loader chính xác.
- `staleTime`: Thiết lập `staleTime: 0` cho dữ liệu quan trọng thường xuyên thay đổi để luôn lấy bản mới nhất.
- Xử lý mảng (key): Khi dùng `.map()` để render danh sách, bắt buộc `key` duy nhất (thường là `id`); không dùng `index` nếu danh sách có thể thay đổi thứ tự.

Ví dụ form:

```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  // ...validate, transform, submit
};

return (
  <form onSubmit={handleSubmit}>
    {/* fields */}
    <button type="submit">Lưu</button>
  </form>
);
```

### 3.4. Trạng thái & Đồng bộ Cache (React Query)

- Invalidation: Sau mỗi hành động create/update/delete thành công, bắt buộc gọi `queryClient.invalidateQueries` cho `queryKey` liên quan (VD: `["users"]`).
- Thông báo (feedback): Tuyệt đối không dùng `alert()`. Dùng `toast.success` hoặc `toast.error` và ưu tiên lấy `message` từ response của Backend.

Ví dụ:

```jsx
await mutation.mutateAsync(payload);
await queryClient.invalidateQueries({ queryKey: ["users"] });
toast.success(res.message ?? "Thành công");
```

### 3.5. Data Loading (React Router Loader)

- Không dùng `useEffect` để fetch data nếu đã có Loader hoặc React Query.

### 3.6. Nhận dữ liệu trả về

```jsx
// Trang danh sách
const {
  data: { users, pagination },
} = useLoaderData();

// Trang chỉnh sửa
const {
  data: { user },
} = useLoaderData();
```

### 3.7. Đối với server

- Luôn validate dữ liệu (Joi) trước khi vào controller.
  - Docs: https://joi.dev/api/?v=17.13.3
- Tầng route: mọi API phải xác thực đăng nhập thành công trước khi vào controller; tiền tố API phải có version để quản lý (ví dụ: `api/v1`).
  - Ví dụ:
    - POST: `api/v1/user/`
    - PUT: `api/v1/user/`
    - GET (nhiều): `api/v1/users`
    - GET (chi tiết): `api/v1/user/:id` (không dùng `?id=`)
    - DELETE: `api/v1/user/:id`
- Tầng controller và service phải thống nhất cùng tên hàm.

Ví dụ:

```js
const userController = {
  createUser: async (req, res) => {
    await userService.createUser();
  },
  getUserById: async (req, res) => {},
  getUsersAll: async (req, res) => {},
  updateUser: async (req, res) => {},
  deleteUser: async (req, res) => {},
};
```

- Tầng service khi xử lý với database sử dụng Prisma.
  - Docs: https://www.prisma.io/docs/orm/prisma-client/queries/crud

---

### 3.8. Quy định về Quản lý Trạng thái (State Management)

Để code dễ đọc, mở rộng tốt khi số lượng state tăng, áp dụng các quy tắc sau:

- **URL là "Single Source of Truth"**:
  - Các trạng thái như: `selectedId`, `activeTab`, `filters`, `page`, `keyword` phải đồng bộ qua URL (Query Params hoặc Path Params), không lưu riêng trong `useState`.
  - Ví dụ: `?page=2&keyword=bmw&tab=inventory`.
  - Lợi ích: giảm tải bộ nhớ, hỗ trợ Back/Forward, chia sẻ link, reload an toàn.

- **Cấu trúc phẳng (Flat State)**:
  - Tránh object lồng sâu; ưu tiên các trường đơn để cập nhật đơn giản và render ổn định.
  - Với danh sách lớn, cân nhắc chuẩn hóa theo `ids` + `byId` khi cần.

- **Quy tắc đặt tên và gom nhóm**:
  - Theo format: `[value, setValue]`.
  - Gom nhóm các state UI (đóng/mở, ẩn/hiện) cùng nhau; các state dữ liệu cùng nhau.

- **Derived state**:
  - Không lưu các giá trị có thể suy ra từ nguồn khác (props, query params, dữ liệu server).

- **Phạm vi state**:
  - UI cục bộ: dùng `useState` trong component.
  - UI dùng chung: cân nhắc `Context/Store` hoặc Router state; tránh global hóa không cần thiết.

```jsx
// URL as Single Source of Truth (React Router v6)
import { useSearchParams, useParams } from "react-router-dom";

const [searchParams, setSearchParams] = useSearchParams();
const { id } = useParams(); // ví dụ: bản ghi đang chọn

const page = Number(searchParams.get("page") ?? 1);
const keyword = searchParams.get("keyword") ?? "";

const handlePageChange = (next) => {
  setSearchParams({ page: String(next), keyword });
};

// State UI
const [modalOpen, setModalOpen] = useState(false);
// End State UI

// State Form
const [name, setName] = useState("");
// End State Form
```

## 4. Báo cáo lỗi (Reporting Bugs)

Nếu phát hiện lỗi, hãy nhắn tin lên nhóm hoặc tạo Issue trên Github với mô tả rõ ràng:

1.  Lỗi là gì?
2.  Làm sao để tái hiện lỗi đó? (Các bước thực hiện).
3.  Mong muốn kết quả đúng là gì?

---

_Chúc cả nhóm làm việc hiệu quả!_
