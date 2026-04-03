const fs = require('fs');

const path = 'client/src/features/inventory/components/InventoryList.jsx';
let content = fs.readFileSync(path, 'utf8');

// Replace "Tên vật tư", with "Tên vật tư / NCC",
content = content.replace(/"Tên vật tư",/, '"Tên vật tư / NCC",');

// Insert supplier line below part name
content = content.replace(/<p className="text-sm font-semibold text-on-surface">\s*<Link to=\{\`\/inventory\/stock-card\?id=\$\{item\.id\}\`\} className="hover:underline">\{item\.name\}<\/Link>\s*<\/p>/, 
  `<p className="text-sm font-semibold text-on-surface">
                    <Link to={\`/inventory/stock-card?id=\$\{item.id\}\`} className="hover:underline">{item.name}</Link>
                  </p>
                  <p className="text-[10px] text-on-surface-variant font-medium">
                    NCC: {item.supplier}
                  </p>`);

fs.writeFileSync(path, content);
console.log("Updated InventoryList.jsx 2");
