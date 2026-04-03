import axiosClient from '../../../src/lib/axiosClient.js';
import { searchTopbarEntities } from '../../../src/features/search/topbarSearch.api.js';

export default async function run() {
  console.log('Running topbar global search smoke flow (API runtime check)...');

  const originalGet = axiosClient.get;
  const calls = [];

  axiosClient.get = async (url, config) => {
    calls.push({ url, config });

    if (url === '/api/v1/customers') {
      return {
        data: {
          data: {
            customers: [{ MaKH: 1, TenChuXe: 'Nguyễn Văn A', DienThoai: '0901234567' }],
          },
        },
      };
    }

    if (url === '/api/v1/vehicles') {
      return {
        data: {
          data: {
            vehicles: [{ MaXe: 2, BienSo: '51A-123.45', KhachHang: { MaKH: 1, TenChuXe: 'Nguyễn Văn A' } }],
          },
        },
      };
    }

    if (url === '/api/v1/repair-orders') {
      return {
        data: {
          data: {
            repairOrders: [{ MaPhieuSC: 3, NoiDungLoi: 'Máy rung khi tăng tốc' }],
          },
        },
      };
    }

    if (url === '/api/v1/parts') {
      return {
        data: {
          data: {
            parts: [{ MaVatTu: 4, TenVatTu: 'Lọc dầu', DonViTinh: 'Cái' }],
          },
        },
      };
    }

    throw new Error(`Unexpected url in topbar smoke: ${url}`);
  };

  try {
    const results = await searchTopbarEntities('xe');

    if (results.length !== 4) {
      throw new Error(`Expected 4 search results, got ${results.length}`);
    }

    const expectedParams = { page: 1, limit: 5, search: 'xe' };
    const assertCall = (index, expectedUrl) => {
      const call = calls[index];
      if (call.url !== expectedUrl) {
        throw new Error(`Expected url ${expectedUrl}, got ${call.url}`);
      }

      if (JSON.stringify(call.config?.params) !== JSON.stringify(expectedParams)) {
        throw new Error(
          `Expected params ${JSON.stringify(expectedParams)}, got ${JSON.stringify(call.config?.params)}`,
        );
      }
    };

    assertCall(0, '/api/v1/customers');
    assertCall(1, '/api/v1/vehicles');
    assertCall(2, '/api/v1/repair-orders');
    assertCall(3, '/api/v1/parts');

    const customer = results.find((item) => item.type === 'customer');
    const vehicle = results.find((item) => item.type === 'vehicle');
    const repairOrder = results.find((item) => item.type === 'repair-order');
    const part = results.find((item) => item.type === 'part');

    if (customer?.link !== '/customers/detail?id=1') {
      throw new Error(`Expected customer link '/customers/detail?id=1', got '${customer?.link}'`);
    }

    if (vehicle?.link !== '/customers/detail?id=1') {
      throw new Error(`Expected vehicle link '/customers/detail?id=1', got '${vehicle?.link}'`);
    }

    if (repairOrder?.link !== '/repair-orders/3') {
      throw new Error(`Expected repair-order link '/repair-orders/3', got '${repairOrder?.link}'`);
    }

    if (part?.link !== '/inventory/stock-card?id=4') {
      throw new Error(`Expected part link '/inventory/stock-card?id=4', got '${part?.link}'`);
    }

    const shortQueryResults = await searchTopbarEntities('x');
    if (shortQueryResults.length !== 0) {
      throw new Error('Expected no requests for query shorter than 2 characters');
    }
  } finally {
    axiosClient.get = originalGet;
  }
}
