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
  const routeRegistryExists = await fileExists("../src/routes/route.registry.js");
  const routeDefinitionContent = routesIndexContent;

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

  const expectedProtectedRoutes = [
    ["customers", "customerRoute"],
    ["car-brands", "carBrandRoute"],
    ["vehicles", "vehicleRoute"],
    ["repair-orders", "repairOrderRoute"],
    ["labor-fees", "laborFeeRoute"],
    ["parts", "partRoute"],
    ["repair-order-details", "repairOrderDetailRoute"],
    ["suppliers", "supplierRoute"],
    ["stock-receipts", "stockReceiptRoute"],
    ["stock-receipt-details", "stockReceiptDetailRoute"],
    ["payment-receipts", "paymentReceiptRoute"],
  ];

  const legacyRouteSegments = [
    "user",
    "hieu-xe",
    "xe",
    "phieu-sua-chua",
    "tien-cong",
    "vat-tu",
    "ct-phieu-sua-chua",
    "nha-cung-cap",
    "phieu-nhap-kho",
    "ct-phieu-nhap",
    "phieu-thu-tien",
  ];

  assert.equal(routeRegistryExists, false, "route.registry.js should not exist");
  assert.doesNotMatch(routesIndexContent, /route\.registry\.js/);
  assert.doesNotMatch(routesIndexContent, /createRoutesRegistrar\(/);
  assert.match(routeDefinitionContent, /const apiPrefixV1\s*=\s*"\/api\/v1"/);
  assert.match(routesIndexContent, /app\.use\(`\$\{apiPrefixV1\}\/auth`,\s*authRoute\)/);

  for (const [routePath, routeModule] of expectedProtectedRoutes) {
    const escapedRoutePath = routePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    assert.match(
      routesIndexContent,
      new RegExp(
        `app\\.use\\([\\s\\S]*?\\$\\{apiPrefixV1\\}\\/${escapedRoutePath}[\\s\\S]*?\\.\\.\\.requireManagementAccess[\\s\\S]*?${routeModule}[\\s\\S]*?\\)`,
      ),
      `${routePath} should be mounted with ${routeModule} in index.route.js`,
    );
  }

  for (const routePath of legacyRouteSegments) {
    const escapedRoutePath = routePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    assert.doesNotMatch(
      routeDefinitionContent,
      new RegExp(`(?:["'\\/])${escapedRoutePath}(?:["'\\/,])`),
    );
  }
});
