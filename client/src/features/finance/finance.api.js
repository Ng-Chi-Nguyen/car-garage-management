const mockReceivables = [
  {
    plate: "51G-123.45",
    customer: "Nguyễn Văn An",
    tier: "Hạng Vàng",
    debt: 12500000,
    updatedAt: "Hôm nay",
  },
  {
    plate: "60A-987.12",
    customer: "Trần Thị Bích",
    tier: "Hạng Bạc",
    debt: 3200000,
    updatedAt: "2 ngày trước",
  },
  {
    plate: "51K-555.21",
    customer: "Garage Auto-X",
    tier: "Đối tác",
    debt: 45000000,
    updatedAt: "15 ngày trước",
  },
];

export async function fetchReceivables() {
  return [...mockReceivables];
}

export async function createReceivable(data) {
  return { id: "REC-" + Date.now(), ...data };
}

export async function fetchSettlement(id) {
  return { id, status: "completed" };
}
