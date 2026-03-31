// Mock API for Settings

export async function fetchSystemParameters() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        maxCarsPerDay: 20,
        materialProfitMargin: 15,
        lastUpdated: "Hôm nay, 14:32",
        updatedBy: "Admin",
      });
    }, 500);
  });
}

export async function updateSystemParameters(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 500);
  });
}

export async function fetchServicePrices() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Thay dầu & Lọc dầu", duration: "30 phút", price: 150000 },
        { id: 2, name: "Bảo dưỡng phanh (4 bánh)", duration: "60 phút", price: 450000 },
        { id: 3, name: "Vệ sinh khoang máy", duration: "90 phút", price: 800000 },
        { id: 4, name: "Đọc lỗi & Xóa lỗi OBD", duration: "15 phút", price: 200000 },
      ]);
    }, 500);
  });
}

export async function fetchCarBrands() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "TOYOTA", modelCount: 12, description: "Vios, Camry, Fortuner, Corolla Cross..." },
        { id: 2, name: "HONDA", modelCount: 8, description: "City, Civic, CR-V, HR-V..." },
        { id: 3, name: "MERCEDES-BENZ", modelCount: 15, description: "C-Class, E-Class, GLC, S-Class..." },
      ]);
    }, 500);
  });
}
