import { readFile } from 'node:fs/promises';

export default async function run() {
  const [indexRouteSource, settingsServiceSource] = await Promise.all([
    readFile(new URL('../../../../server/src/routes/index.route.js', import.meta.url), 'utf8'),
    readFile(new URL('../../../../server/src/services/settings/settings.service.js', import.meta.url), 'utf8'),
  ]);

  if (/workflows\/payment-receipts/u.test(indexRouteSource)) {
    throw new Error('canonical route table still mounts payment-receipts workflow');
  }

  if (!/app\.use\(`\$\{apiPrefixV1\}\/payment-receipts`,\s*\.\.\.requireManagementAccess,\s*paymentReceiptRoute\);/u.test(indexRouteSource)) {
    throw new Error('payment receipts management route is missing');
  }

  if (!/modelCount:\s*carBrand\._count\?\.Xe\s*\?\?\s*carBrand\.Xe\?\.length\s*\?\?\s*0/u.test(settingsServiceSource)) {
    throw new Error('car brand modelCount is not derived from relation count');
  }
}
