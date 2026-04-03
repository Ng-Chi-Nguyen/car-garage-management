import test from "node:test";
import assert from "node:assert/strict";
import ExcelJS from "exceljs";
import Joi from "joi";

import { createXlsxService } from "../src/shared/xlsx/xlsx.service.js";

const createWorkbookBuffer = async (sheetName, rows) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.addRow(Object.keys(rows[0]));
  rows.forEach((row) => {
    worksheet.addRow(Object.values(row));
  });

  return workbook.xlsx.writeBuffer();
};

test("createXlsxService importRows tạo mới dữ liệu từ file .xlsx", async () => {
  const createdRows = [];
  const prismaClient = {
    demo: {
      findMany: async () => [],
    },
    $transaction: async (callback) =>
      callback({
        demo: {
          create: async ({ data }) => {
            createdRows.push(data);
            return data;
          },
        },
      }),
  };

  const service = createXlsxService({
    entityLabel: "demo",
    fileBaseName: "demo",
    sheetName: "Demo",
    delegateName: "demo",
    idField: "MaDemo",
    prismaClient,
    columns: [
      { key: "MaDemo", header: "MaDemo", type: "number" },
      { key: "TenDemo", header: "TenDemo", type: "string" },
      { key: "GiaTri", header: "GiaTri", type: "number" },
    ],
    createSchema: Joi.object({
      TenDemo: Joi.string().required(),
      GiaTri: Joi.number().min(0).required(),
    }).unknown(false),
    updateSchema: Joi.object({
      TenDemo: Joi.string(),
      GiaTri: Joi.number().min(0),
    }).min(1).unknown(false),
  });

  const buffer = await createWorkbookBuffer("Demo", [
    { MaDemo: "", TenDemo: "Banh rang", GiaTri: 12.5 },
  ]);

  const result = await service.importRows({ buffer });

  assert.deepEqual(createdRows, [
    {
      TenDemo: "Banh rang",
      GiaTri: 12.5,
    },
  ]);
  assert.equal(result.createdCount, 1);
  assert.equal(result.updatedCount, 0);
  assert.equal(result.skippedCount, 0);
});

test("createXlsxService updateRows cập nhật dữ liệu theo id từ file .xlsx", async () => {
  const updatedRows = [];
  const prismaClient = {
    demo: {
      findMany: async () => [],
    },
    $transaction: async (callback) =>
      callback({
        demo: {
          update: async ({ where, data }) => {
            updatedRows.push({ where, data });
            return { ...where, ...data };
          },
        },
      }),
  };

  const service = createXlsxService({
    entityLabel: "demo",
    fileBaseName: "demo",
    sheetName: "Demo",
    delegateName: "demo",
    idField: "MaDemo",
    prismaClient,
    columns: [
      { key: "MaDemo", header: "MaDemo", type: "number" },
      { key: "TenDemo", header: "TenDemo", type: "string" },
      { key: "GiaTri", header: "GiaTri", type: "number" },
    ],
    createSchema: Joi.object({
      TenDemo: Joi.string().required(),
      GiaTri: Joi.number().min(0).required(),
    }).unknown(false),
    updateSchema: Joi.object({
      TenDemo: Joi.string(),
      GiaTri: Joi.number().min(0),
    }).min(1).unknown(false),
  });

  const buffer = await createWorkbookBuffer("Demo", [
    { MaDemo: 7, TenDemo: "Loc gio", GiaTri: 30 },
  ]);

  const result = await service.updateRows({ buffer });

  assert.deepEqual(updatedRows, [
    {
      where: { MaDemo: 7 },
      data: { TenDemo: "Loc gio", GiaTri: 30 },
    },
  ]);
  assert.equal(result.createdCount, 0);
  assert.equal(result.updatedCount, 1);
});

test("createXlsxService syncRows tạo mới và cập nhật cùng lúc từ file .xlsx", async () => {
  const createdRows = [];
  const updatedRows = [];
  const prismaClient = {
    demo: {
      findMany: async () => [],
    },
    $transaction: async (callback) =>
      callback({
        demo: {
          create: async ({ data }) => {
            createdRows.push(data);
            return data;
          },
          update: async ({ where, data }) => {
            updatedRows.push({ where, data });
            return { ...where, ...data };
          },
        },
      }),
  };

  const service = createXlsxService({
    entityLabel: "demo",
    fileBaseName: "demo",
    sheetName: "Demo",
    delegateName: "demo",
    idField: "MaDemo",
    prismaClient,
    columns: [
      { key: "MaDemo", header: "MaDemo", type: "number" },
      { key: "TenDemo", header: "TenDemo", type: "string" },
      { key: "GiaTri", header: "GiaTri", type: "number" },
    ],
    createSchema: Joi.object({
      TenDemo: Joi.string().required(),
      GiaTri: Joi.number().min(0).required(),
    }).unknown(false),
    updateSchema: Joi.object({
      TenDemo: Joi.string(),
      GiaTri: Joi.number().min(0),
    }).min(1).unknown(false),
  });

  const buffer = await createWorkbookBuffer("Demo", [
    { MaDemo: 7, TenDemo: "Loc gio", GiaTri: 30 },
    { MaDemo: "", TenDemo: "Bugi", GiaTri: 45 },
  ]);

  const result = await service.syncRows({ buffer });

  assert.deepEqual(updatedRows, [
    {
      where: { MaDemo: 7 },
      data: { TenDemo: "Loc gio", GiaTri: 30 },
    },
  ]);
  assert.deepEqual(createdRows, [
    {
      TenDemo: "Bugi",
      GiaTri: 45,
    },
  ]);
  assert.equal(result.createdCount, 1);
  assert.equal(result.updatedCount, 1);
});

test("createXlsxService exportDataBuffer tạo workbook có header đúng", async () => {
  const prismaClient = {
    demo: {
      findMany: async () => [
        { MaDemo: 1, TenDemo: "A", GiaTri: 9.5 },
      ],
    },
  };

  const service = createXlsxService({
    entityLabel: "demo",
    fileBaseName: "demo",
    sheetName: "Demo",
    delegateName: "demo",
    idField: "MaDemo",
    prismaClient,
    columns: [
      { key: "MaDemo", header: "MaDemo", type: "number" },
      { key: "TenDemo", header: "TenDemo", type: "string" },
      { key: "GiaTri", header: "GiaTri", type: "number" },
    ],
    createSchema: Joi.object({
      TenDemo: Joi.string().required(),
      GiaTri: Joi.number().min(0).required(),
    }).unknown(false),
    updateSchema: Joi.object({
      TenDemo: Joi.string(),
      GiaTri: Joi.number().min(0),
    }).min(1).unknown(false),
  });

  const buffer = await service.exportDataBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet("Demo");

  assert.equal(worksheet.getRow(1).getCell(1).value, "MaDemo");
  assert.equal(worksheet.getRow(1).getCell(2).value, "TenDemo");
  assert.equal(worksheet.getRow(2).getCell(2).value, "A");
});

test("createXlsxService createTemplateBuffer gan data validation dropdown cho cot enum", async () => {
  const prismaClient = {
    demo: {
      findMany: async () => [],
    },
  };

  const service = createXlsxService({
    entityLabel: "demo",
    fileBaseName: "demo",
    sheetName: "Demo",
    delegateName: "demo",
    idField: "MaDemo",
    prismaClient,
    columns: [
      { key: "MaDemo", header: "MaDemo", type: "number" },
      {
        key: "TrangThai",
        header: "TrangThai",
        type: "string",
        validation: {
          type: "list",
          formulae: ['"Moi,DangXuLy,HoanTat"'],
        },
      },
    ],
    createSchema: Joi.object({
      TrangThai: Joi.string().required(),
    }).unknown(false),
    updateSchema: Joi.object({
      TrangThai: Joi.string(),
    }).min(1).unknown(false),
  });

  const buffer = await service.createTemplateBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet("Demo");

  assert.equal(worksheet.getCell("B2").dataValidation.type, "list");
  assert.deepEqual(worksheet.getCell("B2").dataValidation.formulae, ['"Moi,DangXuLy,HoanTat"']);
});

test("createXlsxService createTemplateBuffer gan dinh dang va validation cho cot ngay", async () => {
  const prismaClient = {
    demo: {
      findMany: async () => [],
    },
  };

  const service = createXlsxService({
    entityLabel: "demo",
    fileBaseName: "demo",
    sheetName: "Demo",
    delegateName: "demo",
    idField: "MaDemo",
    prismaClient,
    columns: [
      { key: "MaDemo", header: "MaDemo", type: "number" },
      {
        key: "NgayLap",
        header: "NgayLap",
        type: "string",
        numFmt: "yyyy-mm-dd",
        validation: {
          type: "date",
          operator: "between",
          formulae: ["DATE(2000,1,1)", "DATE(2100,12,31)"],
          prompt: "Nhap ngay theo dinh dang yyyy-mm-dd.",
        },
      },
    ],
    createSchema: Joi.object({
      NgayLap: Joi.date().required(),
    }).unknown(false),
    updateSchema: Joi.object({
      NgayLap: Joi.date(),
    }).min(1).unknown(false),
  });

  const buffer = await service.createTemplateBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet("Demo");

  assert.equal(worksheet.getColumn(2).numFmt, "yyyy-mm-dd");
  assert.equal(worksheet.getCell("B2").dataValidation.type, "date");
  assert.equal(worksheet.getCell("B2").dataValidation.operator, "between");
  assert.equal(worksheet.getCell("B2").dataValidation.showInputMessage, true);
  assert.equal(worksheet.getCell("B2").dataValidation.prompt, "Nhap ngay theo dinh dang yyyy-mm-dd.");
});

test("createXlsxService createTemplateBuffer hien du lieu DB va van giu validation", async () => {
  const prismaClient = {
    demo: {
      findMany: async () => [
        {
          MaDemo: 1,
          TenDemo: "Ban ghi A",
          TrangThai: "Moi",
        },
      ],
    },
  };

  const service = createXlsxService({
    entityLabel: "demo",
    fileBaseName: "demo",
    sheetName: "Demo",
    delegateName: "demo",
    idField: "MaDemo",
    prismaClient,
    columns: [
      { key: "MaDemo", header: "MaDemo", type: "number" },
      { key: "TenDemo", header: "TenDemo", type: "string" },
      {
        key: "TrangThai",
        header: "TrangThai",
        type: "string",
        validation: {
          type: "list",
          formulae: ['"Moi,DangXuLy,HoanTat"'],
        },
      },
    ],
    createSchema: Joi.object({
      TenDemo: Joi.string().required(),
      TrangThai: Joi.string().required(),
    }).unknown(false),
    updateSchema: Joi.object({
      TenDemo: Joi.string(),
      TrangThai: Joi.string(),
    }).min(1).unknown(false),
  });

  const buffer = await service.createTemplateBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet("Demo");

  assert.equal(worksheet.getRow(2).getCell(1).value, 1);
  assert.equal(worksheet.getRow(2).getCell(2).value, "Ban ghi A");
  assert.equal(worksheet.getRow(2).getCell(3).value, "Moi");
  assert.equal(worksheet.getCell("C2").dataValidation.type, "list");
  assert.deepEqual(worksheet.getCell("C2").dataValidation.formulae, ['"Moi,DangXuLy,HoanTat"']);
});

test("createXlsxService createTemplateBuffer cho phep prepareWorkbook gan dropdown dong khi da prefill du lieu", async () => {
  const prismaClient = {
    demo: {
      findMany: async () => [
        {
          MaDemo: 1,
          MaRef: 2,
        },
      ],
    },
  };

  const service = createXlsxService({
    entityLabel: "demo",
    fileBaseName: "demo",
    sheetName: "Demo",
    delegateName: "demo",
    idField: "MaDemo",
    prismaClient,
    columns: [
      { key: "MaDemo", header: "MaDemo", type: "number" },
      { key: "MaRef", header: "MaRef", type: "number" },
    ],
    createSchema: Joi.object({
      MaRef: Joi.number().required(),
    }).unknown(false),
    updateSchema: Joi.object({
      MaRef: Joi.number(),
    }).min(1).unknown(false),
    prepareWorkbook: async ({ workbook, worksheet }) => {
      const listWorksheet = workbook.addWorksheet("_demo_lists");
      listWorksheet.state = "veryHidden";
      listWorksheet.getCell("A1").value = "DemoOption";
      listWorksheet.getCell("A2").value = "1 - Demo A";
      listWorksheet.getCell("A3").value = "2 - Demo B";

      for (let rowNumber = 2; rowNumber <= 10; rowNumber += 1) {
        worksheet.getCell(`B${rowNumber}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: ["'_demo_lists'!$A$2:$A$3"],
        };
      }
    },
  });

  const buffer = await service.createTemplateBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet("Demo");

  assert.equal(worksheet.getRow(2).getCell(1).value, 1);
  assert.equal(worksheet.getRow(2).getCell(2).value, 2);
  assert.equal(worksheet.getCell("B2").dataValidation.type, "list");
  assert.deepEqual(worksheet.getCell("B2").dataValidation.formulae, ["'_demo_lists'!$A$2:$A$3"]);
});

test("createXlsxService createTemplateBuffer ap dung exportRows khi prefill du lieu", async () => {
  const prismaClient = {
    demo: {
      findMany: async () => [
        {
          MaDemo: 1,
          NgayLap: new Date("2026-04-02T00:00:00.000Z"),
        },
      ],
    },
  };

  const service = createXlsxService({
    entityLabel: "demo",
    fileBaseName: "demo",
    sheetName: "Demo",
    delegateName: "demo",
    idField: "MaDemo",
    prismaClient,
    columns: [
      { key: "MaDemo", header: "MaDemo", type: "number" },
      { key: "NgayLap", header: "NgayLap", type: "string" },
    ],
    createSchema: Joi.object({
      NgayLap: Joi.string().required(),
    }).unknown(false),
    updateSchema: Joi.object({
      NgayLap: Joi.string(),
    }).min(1).unknown(false),
    exportRows: (rows) => rows.map((row) => ({
      ...row,
      NgayLap: row.NgayLap.toISOString().slice(0, 10),
    })),
  });

  const buffer = await service.createTemplateBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet("Demo");

  assert.equal(worksheet.getRow(2).getCell(2).value, "2026-04-02");
});

test("createXlsxService exportDataBuffer khong gan validation mac dinh cho cot enum", async () => {
  const prismaClient = {
    demo: {
      findMany: async () => [],
    },
  };

  const service = createXlsxService({
    entityLabel: "demo",
    fileBaseName: "demo",
    sheetName: "Demo",
    delegateName: "demo",
    idField: "MaDemo",
    prismaClient,
    columns: [
      { key: "MaDemo", header: "MaDemo", type: "number" },
      {
        key: "TrangThai",
        header: "TrangThai",
        type: "string",
        validation: {
          type: "list",
          formulae: ['"Moi,DangXuLy,HoanTat"'],
        },
      },
    ],
    createSchema: Joi.object({
      TrangThai: Joi.string().required(),
    }).unknown(false),
    updateSchema: Joi.object({
      TrangThai: Joi.string(),
    }).min(1).unknown(false),
  });

  const buffer = await service.exportDataBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet("Demo");

  assert.equal(worksheet.getCell("B2").dataValidation, undefined);
});

test("createXlsxService exportDataBuffer cho phep prepareWorkbook gan dropdown dong", async () => {
  const prismaClient = {
    demo: {
      findMany: async () => [],
    },
  };

  const service = createXlsxService({
    entityLabel: "demo",
    fileBaseName: "demo",
    sheetName: "Demo",
    delegateName: "demo",
    idField: "MaDemo",
    prismaClient,
    columns: [
      { key: "MaDemo", header: "MaDemo", type: "number" },
      { key: "MaRef", header: "MaRef", type: "number" },
    ],
    createSchema: Joi.object({
      MaRef: Joi.number().required(),
    }).unknown(false),
    updateSchema: Joi.object({
      MaRef: Joi.number(),
    }).min(1).unknown(false),
    prepareWorkbook: async ({ workbook, worksheet }) => {
      const listWorksheet = workbook.addWorksheet("_demo_lists");
      listWorksheet.state = "veryHidden";
      listWorksheet.getCell("A1").value = "DemoOption";
      listWorksheet.getCell("A2").value = "1 - Demo A";
      listWorksheet.getCell("A3").value = "2 - Demo B";

      for (let rowNumber = 2; rowNumber <= 10; rowNumber += 1) {
        worksheet.getCell(`B${rowNumber}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: ["'_demo_lists'!$A$2:$A$3"],
        };
      }
    },
  });

  const buffer = await service.exportDataBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet("Demo");

  assert.equal(worksheet.getCell("B2").dataValidation.type, "list");
  assert.deepEqual(worksheet.getCell("B2").dataValidation.formulae, ["'_demo_lists'!$A$2:$A$3"]);
});

test("createXlsxService importRows chap nhan so dinh dang text tu Excel", async () => {
  const createdRows = [];
  const prismaClient = {
    demo: {
      findMany: async () => [],
    },
    $transaction: async (callback) =>
      callback({
        demo: {
          create: async ({ data }) => {
            createdRows.push(data);
            return data;
          },
        },
      }),
  };

  const service = createXlsxService({
    entityLabel: "demo",
    fileBaseName: "demo",
    sheetName: "Demo",
    delegateName: "demo",
    idField: "MaDemo",
    prismaClient,
    columns: [
      { key: "MaDemo", header: "MaDemo", type: "number" },
      { key: "NoiDung", header: "NoiDung", type: "string" },
      { key: "DonGia", header: "DonGia", type: "number" },
    ],
    createSchema: Joi.object({
      NoiDung: Joi.string().required(),
      DonGia: Joi.number().required(),
    }).unknown(false),
    updateSchema: Joi.object({
      NoiDung: Joi.string(),
      DonGia: Joi.number(),
    }).min(1).unknown(false),
  });

  const buffer = await createWorkbookBuffer("Demo", [
    { MaDemo: "", NoiDung: "Cong sua", DonGia: "1,200.50" },
  ]);

  await service.importRows({ buffer });

  assert.equal(createdRows[0].DonGia, 1200.5);
});

test("createXlsxService importRows chap nhan so dang chuoi co dau nhay bao ngoai", async () => {
  const createdRows = [];
  const prismaClient = {
    demo: {
      findMany: async () => [],
    },
    $transaction: async (callback) =>
      callback({
        demo: {
          create: async ({ data }) => {
            createdRows.push(data);
            return data;
          },
        },
      }),
  };

  const service = createXlsxService({
    entityLabel: "demo",
    fileBaseName: "demo",
    sheetName: "Demo",
    delegateName: "demo",
    idField: "MaDemo",
    prismaClient,
    columns: [
      { key: "MaDemo", header: "MaDemo", type: "number" },
      { key: "NoiDung", header: "NoiDung", type: "string" },
      { key: "DonGia", header: "DonGia", type: "number" },
    ],
    createSchema: Joi.object({
      NoiDung: Joi.string().required(),
      DonGia: Joi.number().required(),
    }).unknown(false),
    updateSchema: Joi.object({
      NoiDung: Joi.string(),
      DonGia: Joi.number(),
    }).min(1).unknown(false),
  });

  const buffer = await createWorkbookBuffer("Demo", [
    { MaDemo: "", NoiDung: "Bao duong", DonGia: '"450000"' },
  ]);

  await service.importRows({ buffer });

  assert.equal(createdRows[0].DonGia, 450000);
});

test("createXlsxService importRows chap nhan gia tri dropdown dang MaSo - Ten", async () => {
  const createdRows = [];
  const prismaClient = {
    demo: {
      findMany: async () => [],
    },
    $transaction: async (callback) =>
      callback({
        demo: {
          create: async ({ data }) => {
            createdRows.push(data);
            return data;
          },
        },
      }),
  };

  const service = createXlsxService({
    entityLabel: "demo",
    fileBaseName: "demo",
    sheetName: "Demo",
    delegateName: "demo",
    idField: "MaDemo",
    prismaClient,
    columns: [
      { key: "MaDemo", header: "MaDemo", type: "number" },
      { key: "TenDemo", header: "TenDemo", type: "string" },
      { key: "MaRef", header: "MaRef", type: "number" },
    ],
    createSchema: Joi.object({
      TenDemo: Joi.string().required(),
      MaRef: Joi.number().integer().positive().required(),
    }).unknown(false),
    updateSchema: Joi.object({
      TenDemo: Joi.string(),
      MaRef: Joi.number().integer().positive(),
    }).min(1).unknown(false),
  });

  const buffer = await createWorkbookBuffer("Demo", [
    { MaDemo: "", TenDemo: "Bao duong", MaRef: "6 - Nha cung cap A" },
  ]);

  await service.importRows({ buffer });

  assert.equal(createdRows[0].MaRef, 6);
});

test("createXlsxService importRows bo qua dong da co id", async () => {
  const createdRows = [];
  const prismaClient = {
    demo: {
      findMany: async () => [],
    },
    $transaction: async (callback) =>
      callback({
        demo: {
          create: async ({ data }) => {
            createdRows.push(data);
            return data;
          },
        },
      }),
  };

  const service = createXlsxService({
    entityLabel: "demo",
    fileBaseName: "demo",
    sheetName: "Demo",
    delegateName: "demo",
    idField: "MaDemo",
    prismaClient,
    columns: [
      { key: "MaDemo", header: "MaDemo", type: "number" },
      { key: "TenDemo", header: "TenDemo", type: "string" },
    ],
    createSchema: Joi.object({
      TenDemo: Joi.string().required(),
    }).unknown(false),
    updateSchema: Joi.object({
      TenDemo: Joi.string(),
    }).min(1).unknown(false),
  });

  const buffer = await createWorkbookBuffer("Demo", [
    { MaDemo: 5, TenDemo: "Da ton tai" },
    { MaDemo: "", TenDemo: "Moi" },
  ]);

  const result = await service.importRows({ buffer });

  assert.deepEqual(createdRows, [{ TenDemo: "Moi" }]);
  assert.equal(result.createdCount, 1);
  assert.equal(result.skippedCount, 1);
});

test("createXlsxService bo qua cot phu chi de hien thi khi import", async () => {
  const createdRows = [];
  const prismaClient = {
    demo: {
      findMany: async () => [],
    },
    $transaction: async (callback) =>
      callback({
        demo: {
          create: async ({ data }) => {
            createdRows.push(data);
            return data;
          },
        },
      }),
  };

  const service = createXlsxService({
    entityLabel: "demo",
    fileBaseName: "demo",
    sheetName: "Demo",
    delegateName: "demo",
    idField: "MaDemo",
    prismaClient,
    columns: [
      { key: "MaDemo", header: "MaDemo", type: "number" },
      { key: "TenDemo", header: "TenDemo", type: "string" },
      { key: "MaRef", header: "MaRef", type: "number" },
      { key: "TenRef", header: "TenRef", type: "string", writable: false },
    ],
    createSchema: Joi.object({
      TenDemo: Joi.string().required(),
      MaRef: Joi.number().integer().positive().required(),
    }).unknown(false),
    updateSchema: Joi.object({
      TenDemo: Joi.string(),
      MaRef: Joi.number().integer().positive(),
    }).min(1).unknown(false),
  });

  const buffer = await createWorkbookBuffer("Demo", [
    { MaDemo: "", TenDemo: "Xe A", MaRef: "10 - Toyota", TenRef: "Toyota" },
  ]);

  await service.importRows({ buffer });

  assert.deepEqual(createdRows, [
    {
      TenDemo: "Xe A",
      MaRef: 10,
    },
  ]);
});

test("createXlsxService ap dung beforeCreate va beforeUpdate de bo sung truong tinh toan", async () => {
  const createdRows = [];
  const updatedRows = [];
  const prismaClient = {
    demo: {
      findMany: async () => [],
    },
    $transaction: async (callback) =>
      callback({
        demo: {
          create: async ({ data }) => {
            createdRows.push(data);
            return data;
          },
          update: async ({ where, data }) => {
            updatedRows.push({ where, data });
            return { ...where, ...data };
          },
        },
      }),
  };

  const service = createXlsxService({
    entityLabel: "demo",
    fileBaseName: "demo",
    sheetName: "Demo",
    delegateName: "demo",
    idField: "MaDemo",
    prismaClient,
    columns: [
      { key: "MaDemo", header: "MaDemo", type: "number" },
      { key: "SoLuong", header: "SoLuong", type: "number" },
      { key: "DonGia", header: "DonGia", type: "number" },
    ],
    createSchema: Joi.object({
      SoLuong: Joi.number().required(),
      DonGia: Joi.number().required(),
    }).unknown(false),
    updateSchema: Joi.object({
      SoLuong: Joi.number(),
      DonGia: Joi.number(),
    }).min(1).unknown(false),
    beforeCreate: (payload) => ({
      ...payload,
      ThanhTien: payload.SoLuong * payload.DonGia,
    }),
    beforeUpdate: (payload) => ({
      ...payload,
      ...(payload.SoLuong !== undefined && payload.DonGia !== undefined
        ? { ThanhTien: payload.SoLuong * payload.DonGia }
        : {}),
    }),
  });

  const importBuffer = await createWorkbookBuffer("Demo", [
    { MaDemo: "", SoLuong: 2, DonGia: 150000 },
  ]);
  const updateBuffer = await createWorkbookBuffer("Demo", [
    { MaDemo: 7, SoLuong: 3, DonGia: 120000 },
  ]);

  await service.importRows({ buffer: importBuffer });
  await service.updateRows({ buffer: updateBuffer });

  assert.deepEqual(createdRows, [
    {
      SoLuong: 2,
      DonGia: 150000,
      ThanhTien: 300000,
    },
  ]);
  assert.deepEqual(updatedRows, [
    {
      where: { MaDemo: 7 },
      data: {
        SoLuong: 3,
        DonGia: 120000,
        ThanhTien: 360000,
      },
    },
  ]);
});
