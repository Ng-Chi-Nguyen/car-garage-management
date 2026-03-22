import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const fileExists = async (filePath) => {
  try {
    await access(new URL(filePath, import.meta.url));
    return true;
  } catch {
    return false;
  }
};

test("CRUD file names and routes use English naming", async () => {
  const routesIndexPath = new URL("../src/routes/index.route.js", import.meta.url);
  const routesIndexContent = await readFile(routesIndexPath, "utf8");

  const expectedFiles = [
    "../src/routes/management/customer.route.js",
    "../src/routes/management/carBrand.route.js",
    "../src/routes/management/vehicle.route.js",
    "../src/routes/management/repairOrder.route.js",
    "../src/routes/management/laborFee.route.js",
    "../src/routes/management/part.route.js",
    "../src/routes/management/repairOrderDetail.route.js",
    "../src/routes/management/supplier.route.js",
    "../src/routes/management/stockReceipt.route.js",
    "../src/routes/management/stockReceiptDetail.route.js",
    "../src/routes/management/paymentReceipt.route.js",
  ];

  const legacyFiles = [
    "../src/routes/management/user.route.js",
    "../src/routes/management/hieuXe.route.js",
    "../src/routes/management/xe.route.js",
    "../src/routes/management/phieuSuaChua.route.js",
    "../src/routes/management/tienCong.route.js",
    "../src/routes/management/vatTu.route.js",
    "../src/routes/management/ctPhieuSuaChua.route.js",
    "../src/routes/management/nhaCungCap.route.js",
    "../src/routes/management/phieuNhapKho.route.js",
    "../src/routes/management/ctPhieuNhap.route.js",
    "../src/routes/management/phieuThuTien.route.js",
  ];

  for (const filePath of expectedFiles) {
    assert.equal(await fileExists(filePath), true, `${filePath} should exist`);
  }

  for (const filePath of legacyFiles) {
    assert.equal(await fileExists(filePath), false, `${filePath} should not exist`);
  }

  const expectedRouteSuffixes = [
    "/customers",
    "/car-brands",
    "/vehicles",
    "/repair-orders",
    "/labor-fees",
    "/parts",
    "/repair-order-details",
    "/suppliers",
    "/stock-receipts",
    "/stock-receipt-details",
    "/payment-receipts",
  ];

  const legacyRouteSuffixes = [
    "/user",
    "/hieu-xe",
    "/xe",
    "/phieu-sua-chua",
    "/tien-cong",
    "/vat-tu",
    "/ct-phieu-sua-chua",
    "/nha-cung-cap",
    "/phieu-nhap-kho",
    "/ct-phieu-nhap",
    "/phieu-thu-tien",
  ];

  assert.match(routesIndexContent, /const apiPrefixV1 = "\/api\/v1";/);

  for (const routePath of expectedRouteSuffixes) {
    assert.match(routesIndexContent, new RegExp(routePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const routePath of legacyRouteSuffixes) {
    assert.doesNotMatch(routesIndexContent, new RegExp(routePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
