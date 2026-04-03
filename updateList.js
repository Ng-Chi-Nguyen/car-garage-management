const fs = require('fs');

const path = 'client/src/features/inventory/components/InventoryList.jsx';
let content = fs.readFileSync(path, 'utf8');

// Replace mock category filters with stockStatus filters
const newFilters = `          {['all', 'in_stock', 'low_stock', 'out_of_stock'].map((status) => {
            const labels = {
              all: 'Tất cả',
              in_stock: 'Còn hàng',
              low_stock: 'Sắp hết',
              out_of_stock: 'Hết hàng'
            };
            const isActive = filters.stockStatus === status || (!filters.stockStatus && status === 'all');
            return (
              <button 
                key={status}
                onClick={() => setFilters({ stockStatus: status === 'all' ? undefined : status, page: 1 })}
                className={\`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors \${
                  isActive 
                    ? 'bg-surface-container-lowest shadow-sm text-primary' 
                    : 'hover:bg-surface-container-high text-on-surface-variant'
                }\`}
              >
                {labels[status]}
              </button>
            );
          })}`;

content = content.replace(/\{.*?map\(\(cat\) => \{[\s\S]*?\}\)\}\s*\<\/div\>/, newFilters + "\n        </div>");

// Implement search using form onSubmit
const searchReplacement = `<form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            setFilters({ search: formData.get('search'), page: 1 });
          }}>
          <SearchInput 
            name="search"
            placeholder="Tìm kiếm vật tư, mã phụ tùng..." 
            defaultValue={filters.search}
          />
          </form>`;

content = content.replace(/<SearchInput[\s\S]*?\/>/, searchReplacement);

// Update table headers: removing "Tên vật tư / Nhóm", adding "Tên vật tư"
content = content.replace(/"Tên vật tư \/ Nhóm",/, '"Tên vật tư",');
content = content.replace(/<p className="text-\[10px\] text-on-surface-variant font-medium">\s*Nhóm: \{item\.group\}\s*<\/p>/, '');

fs.writeFileSync(path, content);
console.log("Updated InventoryList.jsx");
