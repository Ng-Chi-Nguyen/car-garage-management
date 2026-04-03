import stockReceiptWorkflowSchema from '../../../../server/src/validator/workflows/stockReceiptWorkflow.validator.js';

export default async function run() {
  console.log('Running inventory smoke flow (contract check)...');

  const validStockReceipt = {
    stockReceipt: {
      MaNCC: 1,
      NgayNhap: new Date().toISOString()
    },
    details: [
      {
        MaVatTu: 101,
        SoLuong: 50,
        DonGiaNhap: 120000
      }
    ]
  };

  const { error } = stockReceiptWorkflowSchema.create.body.validate(validStockReceipt);
  if (error) {
    throw new Error(`Inventory contract broke for valid data: ${error.message}`);
  }

  const invalidStockReceipt = {
    stockReceipt: {
      MaNCC: 1,
      NgayNhap: new Date().toISOString()
    },
    details: [
      {
        MaVatTu: 101,
        SoLuong: 50
        // missing DonGiaNhap
      }
    ]
  };

  const { error: errorInvalid } = stockReceiptWorkflowSchema.create.body.validate(invalidStockReceipt);
  if (!errorInvalid || !errorInvalid.message.includes('DonGiaNhap')) {
    throw new Error('Inventory contract should have rejected missing DonGiaNhap');
  }
}
