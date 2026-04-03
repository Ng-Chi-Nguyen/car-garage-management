const fs = require('fs');

const apiPath = 'client/src/features/inventory/inventory.api.js';
let apiContent = fs.readFileSync(apiPath, 'utf8');

// Update to use valid payload
apiContent = apiContent.replace(
  /const { category, \.\.\.backendFilters } = filters \|\| \{\};/,
  'const { ...backendFilters } = filters || {};'
);
apiContent = apiContent.replace(
  /group: 'Vật tư', \/\/ Mock group as parts doesn't have it natively/,
  ''
);

fs.writeFileSync(apiPath, apiContent);

const filterPath = 'client/src/features/inventory/inventory.filters.js';
let filterContent = fs.readFileSync(filterPath, 'utf8');

// Replace category with stockStatus
filterContent = filterContent.replace(/category: searchParams.get\('category'\) \|\| 'all',/, "stockStatus: searchParams.get('stockStatus') || '',");
filterContent = filterContent.replace(/newFilters.category/, "newFilters.stockStatus");
filterContent = filterContent.replace(/currentFilters.category/, "currentFilters.stockStatus");

fs.writeFileSync(filterPath, filterContent);
console.log("Updated API and Filters");
