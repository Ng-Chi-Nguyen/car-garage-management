const fs = require('fs');
const path = 'client/src/features/inventory/inventory.api.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/name: part\.TenVatTu,/, "name: part.TenVatTu,\n        supplier: part.NhaCungCap?.TenNCC || 'Chưa xác định',");
fs.writeFileSync(path, content);
