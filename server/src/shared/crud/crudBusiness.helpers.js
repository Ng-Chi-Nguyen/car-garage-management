import { buildServiceError } from "./crud.helpers.js";

// Chuẩn hóa mọi giá trị số đầu vào, mặc định 0 khi null/undefined để tránh NaN trong phép tính.
const toNumberValue = (value) => Number(value ?? 0);

// Tính số nợ còn lại = tổng tiền sửa chữa - tổng tiền đã thu, không cho âm.
const calculateDebt = (totalServiceAmount, totalPaymentAmount) => {
  // Đảm bảo kết quả nợ nhỏ nhất là 0, đồng thời ép kiểu số an toàn cho cả hai vế.
  return Math.max(0, toNumberValue(totalServiceAmount) - toNumberValue(totalPaymentAmount));
};

// Tính chênh lệch tồn kho khi cập nhật dòng chi tiết sửa chữa (cũ - mới).
const calculateRepairStockAdjustment = (previousQuantity, nextQuantity) => {
  // Kết quả dương nghĩa là trả lại kho, âm nghĩa là lấy thêm từ kho.
  return toNumberValue(previousQuantity) - toNumberValue(nextQuantity);
};

// Tính chênh lệch tồn kho khi cập nhật dòng chi tiết phiếu nhập (mới - cũ).
const calculateImportStockAdjustment = (previousQuantity, nextQuantity) => {
  // Kết quả dương nghĩa là tăng thêm tồn kho, âm nghĩa là giảm phần đã nhập trước đó.
  return toNumberValue(nextQuantity) - toNumberValue(previousQuantity);
};

// Tính thành tiền một dòng sửa chữa: số lượng * đơn giá vật tư + tiền công.
const calculateRepairLineTotal = (soLuong, donGiaVatTu, donGiaTienCong) => {
  // Ép kiểu toàn bộ thành số trước khi nhân/cộng để tránh lỗi do dữ liệu chuỗi.
  return (toNumberValue(soLuong) * toNumberValue(donGiaVatTu)) + toNumberValue(donGiaTienCong);
};

// Tính thành tiền một dòng nhập kho: số lượng * đơn giá nhập.
const calculateImportLineTotal = (soLuong, donGiaNhap) => {
  // Chỉ gồm phép nhân vì phiếu nhập không có tiền công.
  return toNumberValue(soLuong) * toNumberValue(donGiaNhap);
};

// Lấy giá trị tổng (_sum) của một trường từ kết quả aggregate và chuẩn hóa về số.
const getAggregateSum = (aggregateResult, field) => {
  // Dùng optional chaining để tránh lỗi khi aggregate hoặc _sum chưa có dữ liệu.
  return toNumberValue(aggregateResult?._sum?.[field]);
};

// Điều chỉnh tồn kho vật tư theo delta trong transaction, có kiểm tra đủ hàng khi trừ kho.
const adjustPartStock = async (tx, maVatTu, quantityDelta) => {
  // Chuẩn hóa mã vật tư thành số để truy vấn đúng kiểu dữ liệu DB.
  const normalizedMaVatTu = Number(maVatTu);
  // Chuẩn hóa lượng thay đổi tồn kho để dùng nhất quán ở update.
  const normalizedQuantityDelta = toNumberValue(quantityDelta);
  // Khởi tạo điều kiện where cơ bản theo mã vật tư.
  const where = {
    // Chỉ tác động đúng vật tư được chỉ định.
    MaVatTu: normalizedMaVatTu,
  };

  // Nếu đang giảm kho thì bổ sung điều kiện tồn kho hiện tại phải đủ để trừ.
  if (normalizedQuantityDelta < 0) {
    // Thêm ràng buộc số lượng tồn phải >= độ lớn lượng cần trừ.
    where.SoLuongTon = {
      // Dùng trị tuyệt đối vì delta âm biểu diễn thao tác trừ tồn kho.
      gte: Math.abs(normalizedQuantityDelta),
    };
  }

  // Cập nhật tồn kho theo delta; updateMany giúp trả count để biết có dòng nào được cập nhật.
  const result = await tx.vAT_TU.updateMany({
    // Áp dụng bộ lọc đã tính phía trên (bao gồm điều kiện đủ tồn nếu cần).
    where,
    data: {
      // Tăng/giảm trực tiếp tồn kho theo lượng chênh lệch.
      SoLuongTon: {
        // Delta có thể dương (tăng) hoặc âm (giảm).
        increment: normalizedQuantityDelta,
      },
    },
  });

  // Nếu có ít nhất một bản ghi được cập nhật thì thao tác thành công, kết thúc sớm.
  if (result.count > 0) {
    return;
  }

  // Trường hợp không cập nhật được: kiểm tra vật tư có tồn tại không để trả lỗi phù hợp.
  const vatTu = await tx.vAT_TU.findUnique({
    // Tìm chính xác theo mã vật tư đầu vào đã chuẩn hóa.
    where: {
      // Điều kiện khóa chính của bảng vật tư.
      MaVatTu: normalizedMaVatTu,
    },
  });

  // Nếu không tìm thấy vật tư thì trả lỗi 404 đúng ngữ cảnh tài nguyên.
  if (!vatTu) {
    // Ném lỗi nghiệp vụ với thông điệp rõ ràng cho client.
    throw buildServiceError(404, "Không tìm thấy vật tư.");
  }

  // Có vật tư nhưng update thất bại nghĩa là không đủ số lượng tồn để trừ.
  throw buildServiceError(400, "Số lượng tồn kho không đủ.");
};

// Đồng bộ tổng tiền của phiếu nhập dựa trên tổng thành tiền các dòng chi tiết.
const syncStockReceiptTotal = async (tx, maPhieuNhap) => {
  // Gom tổng ThanhTien từ bảng chi tiết phiếu nhập theo mã phiếu.
  const aggregateResult = await tx.cT_PHIEU_NHAP.aggregate({
    // Chỉ tính cho đúng một phiếu nhập cần đồng bộ.
    where: {
      // Chuẩn hóa mã phiếu nhập thành số trước khi truy vấn.
      MaPhieuNhap: Number(maPhieuNhap),
    },
    // Chỉ yêu cầu Prisma trả tổng của cột ThanhTien.
    _sum: {
      // Bật tính tổng trường thành tiền.
      ThanhTien: true,
    },
  });

  // Cập nhật lại tổng tiền phiếu nhập từ kết quả aggregate vừa tính.
  await tx.pHIEU_NHAP_KHO.update({
    // Xác định đúng phiếu nhập cần cập nhật.
    where: {
      // Dùng cùng mã phiếu nhập đã chuẩn hóa kiểu số.
      MaPhieuNhap: Number(maPhieuNhap),
    },
    // Ghi lại giá trị tổng tiền đồng bộ với dữ liệu chi tiết.
    data: {
      // Lấy tổng ThanhTien an toàn, mặc định 0 nếu chưa có dòng chi tiết.
      TongTien: getAggregateSum(aggregateResult, "ThanhTien"),
    },
  });
};

// Đồng bộ tiền nợ hiện tại của xe từ tổng phiếu sửa chữa và tổng phiếu thu tiền.
const syncVehicleDebt = async (tx, maXe) => {
  const [phieuSuaChuaAggregate, phieuThuTienAggregate] = await Promise.all([
    tx.pHIEU_SUA_CHUA.aggregate({
      where: {
        MaXe: Number(maXe),
      },
      _sum: {
        TongTien: true,
      },
    }),
    // Tổng hợp tổng tiền đã thu của xe.
    tx.pHIEU_THU_TIEN.aggregate({
      where: {
        MaXe: Number(maXe),
      },
      // Yêu cầu tổng trường SoTienThu.
      _sum: {
        // Cộng dồn số tiền đã thu.
        SoTienThu: true,
      },
    }),
  ]);

  // Cập nhật nợ hiện tại của xe bằng hàm tính nợ chuẩn hóa.
  await tx.xE.update({
    where: {
      MaXe: Number(maXe),
    },
    // Ghi lại trường nợ hiện tại sau khi đồng bộ.
    data: {
      // Nợ = tổng sửa chữa - tổng đã thu, không âm.
      TienNoHienTai: calculateDebt(
        // Lấy tổng tiền sửa chữa đã aggregate.
        getAggregateSum(phieuSuaChuaAggregate, "TongTien"),
        // Lấy tổng tiền đã thu đã aggregate.
        getAggregateSum(phieuThuTienAggregate, "SoTienThu"),
      ),
    },
  });
};

// Đồng bộ tổng tiền phiếu sửa chữa theo chi tiết, sau đó đồng bộ luôn công nợ xe.
const syncRepairOrderTotal = async (tx, maPhieuSC) => {
  // Tính tổng ThanhTien của toàn bộ dòng chi tiết thuộc phiếu sửa chữa.
  const aggregateResult = await tx.cT_PHIEU_SUA_CHUA.aggregate({
    // Lọc theo mã phiếu sửa chữa cần xử lý.
    where: {
      // Chuẩn hóa mã phiếu sửa chữa thành số.
      MaPhieuSC: Number(maPhieuSC),
    },
    // Chỉ tính tổng trường thành tiền.
    _sum: {
      // Bật cờ tính tổng cho cột ThanhTien.
      ThanhTien: true,
    },
  });

  const phieuSuaChua = await tx.pHIEU_SUA_CHUA.update({
    where: {
      MaPhieuSC: Number(maPhieuSC),
    },
    // Dữ liệu cần cập nhật trên phiếu sửa chữa.
    data: {
      // Gán tổng tiền mới từ aggregate chi tiết.
      TongTien: getAggregateSum(aggregateResult, "ThanhTien"),
    },
    select: {
      MaXe: true,
    },
  });

  // Sau khi tổng phiếu sửa chữa thay đổi, cập nhật lại nợ hiện tại của xe liên quan.
  await syncVehicleDebt(tx, phieuSuaChua.MaXe);
};

// Kiểm tra số tiền thu mới/cập nhật không vượt quá khoản nợ còn lại của xe.
const ensurePaymentWithinDebt = async (tx, maXe, soTienThu, excludePaymentId) => {
  const paymentWhere = {
    MaXe: Number(maXe),
  };

  // Khi cập nhật phiếu thu hiện có, loại trừ chính phiếu đó khỏi phép cộng tổng đã thu.
  if (excludePaymentId) {
    paymentWhere.MaPhieuThu = {
      not: Number(excludePaymentId),
    };
  }

  // Tính song song tổng tiền sửa chữa và tổng tiền đã thu (đã loại trừ nếu có).
  const [phieuSuaChuaAggregate, phieuThuTienAggregate] = await Promise.all([
    // Aggregate tổng tiền sửa chữa của xe.
    tx.pHIEU_SUA_CHUA.aggregate({
      where: {
        MaXe: Number(maXe),
      },
      _sum: {
        TongTien: true,
      },
    }),
    // Aggregate tổng số tiền đã thu của xe theo bộ lọc paymentWhere.
    tx.pHIEU_THU_TIEN.aggregate({
      // Áp dụng bộ lọc có thể kèm điều kiện loại trừ phiếu thu hiện tại.
      where: paymentWhere,
      // Chỉ lấy tổng trường SoTienThu.
      _sum: {
        // Tổng tiền đã thu để đối chiếu với nợ khả dụng.
        SoTienThu: true,
      },
    }),
  ]);

  // Tính khoản nợ còn có thể thu sau khi xét toàn bộ dữ liệu hiện tại.
  const availableDebt = calculateDebt(
    // Tổng tiền sửa chữa.
    getAggregateSum(phieuSuaChuaAggregate, "TongTien"),
    // Tổng tiền đã thu.
    getAggregateSum(phieuThuTienAggregate, "SoTienThu"),
  );

  if (toNumberValue(soTienThu) > availableDebt) {
    // Trả lỗi 400 để báo dữ liệu đầu vào không hợp lệ theo quy tắc nghiệp vụ.
    throw buildServiceError(400, "Số tiền thu không được vượt quá số tiền nợ hiện tại.");
  }
};

export {
  adjustPartStock,
  calculateDebt,
  calculateImportLineTotal,
  calculateImportStockAdjustment,
  calculateRepairStockAdjustment,
  calculateRepairLineTotal,
  ensurePaymentWithinDebt,
  syncStockReceiptTotal,
  syncRepairOrderTotal,
  syncVehicleDebt,
  toNumberValue,
};
