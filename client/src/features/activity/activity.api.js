// Mock API for Activity Log
export async function fetchActivityLogs() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          time: "14:30 24/05/2024",
          user: "Nguyễn Văn A",
          initials: "NA",
          role: "Quản trị viên",
          actionType: "Tạo phiếu tiếp nhận",
          details: "Tạo phiếu #PTN-1024 cho xe 30A-123.45",
          status: "success",
          statusLabel: "Thành công",
        },
        {
          id: "2",
          time: "14:15 24/05/2024",
          user: "Lê Thị B",
          initials: "LB",
          role: "Lễ tân",
          actionType: "Cập nhật khách hàng",
          details: "Cập nhật sđt khách hàng KH-2940",
          status: "success",
          statusLabel: "Thành công",
        },
        {
          id: "3",
          time: "13:45 24/05/2024",
          user: "Trần Văn C",
          initials: "TC",
          role: "Kỹ thuật viên",
          actionType: "Nhập vật tư",
          details: "Lỗi kết nối kho khi nhập VT-00922",
          status: "error",
          statusLabel: "Thất bại",
        },
      ]);
    }, 500);
  });
}

export async function fetchActivityStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalActions: 1284,
        trend: "+12.5%",
        activeUsers: 12,
        errors: 3,
        successRate: "99.7%",
      });
    }, 500);
  });
}
