import ExcelJS from "exceljs";

const HEADER_FILL = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF1F4E78" },
};

const ALT_ROW_FILL = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFF6F9FC" },
};

const DEFAULT_EMPTY_MESSAGE = "Khong co du lieu";

const sanitizeSheetName = (value, fallback = "Sheet") => {
  const sanitized = String(value ?? fallback)
    .replace(/[\\/*?:[\]]/g, " ")
    .trim()
    .slice(0, 31);

  return sanitized || fallback;
};

const escapeWorkbookText = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return /^[=+\-@]/.test(value) ? `'${value}` : value;
};

const formatDateValue = (value) => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return value;
  }

  return value.toISOString().slice(0, 10);
};

const normalizeCellValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof Date) {
    return formatDateValue(value);
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return escapeWorkbookText(value);
};

const estimateColumnWidth = (header, rows, key, fallbackWidth = 18) => {
  const maxContentLength = rows.reduce((maxLength, row) => {
    const value = normalizeCellValue(row[key]);
    return Math.max(maxLength, String(value).length);
  }, String(header).length);

  return Math.min(Math.max(maxContentLength + 2, fallbackWidth), 40);
};

const applyWorksheetStyle = (worksheet, rowCount) => {
  if (!worksheet.columnCount) {
    return;
  }

  const lastColumnLetter = worksheet.getColumn(worksheet.columnCount).letter;
  worksheet.autoFilter = {
    from: "A1",
    to: `${lastColumnLetter}1`,
  };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  const headerRow = worksheet.getRow(1);
  headerRow.height = 24;

  headerRow.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin", color: { argb: "FFD9E2F3" } },
      left: { style: "thin", color: { argb: "FFD9E2F3" } },
      bottom: { style: "thin", color: { argb: "FFD9E2F3" } },
      right: { style: "thin", color: { argb: "FFD9E2F3" } },
    };
  });

  for (let rowNumber = 2; rowNumber <= rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);

    row.eachCell((cell) => {
      if (rowNumber % 2 === 0) {
        cell.fill = ALT_ROW_FILL;
      }

      cell.border = {
        top: { style: "thin", color: { argb: "FFEAEAEA" } },
        left: { style: "thin", color: { argb: "FFEAEAEA" } },
        bottom: { style: "thin", color: { argb: "FFEAEAEA" } },
        right: { style: "thin", color: { argb: "FFEAEAEA" } },
      };
      cell.alignment = { vertical: "middle" };
    });
  }
};

const addWorksheet = (workbook, sheet) => {
  const worksheet = workbook.addWorksheet(sanitizeSheetName(sheet.name), {
    properties: {
      tabColor: { argb: "FF5B9BD5" },
    },
  });

  const columns = sheet.columns?.length
    ? sheet.columns
    : [{ header: "ThongBao", key: "message", width: 24 }];

  const rows = sheet.rows?.length ? sheet.rows : [{ message: sheet.emptyMessage ?? DEFAULT_EMPTY_MESSAGE }];

  worksheet.columns = columns.map((column) => ({
    header: column.header,
    key: column.key,
    width: column.width ?? estimateColumnWidth(column.header, rows, column.key),
  }));

  columns.forEach((column, index) => {
    if (column.numFmt) {
      worksheet.getColumn(index + 1).numFmt = column.numFmt;
    }
  });

  rows.forEach((row) => {
    worksheet.addRow(
      Object.fromEntries(columns.map((column) => [column.key, normalizeCellValue(row[column.key])])),
    );
  });

  applyWorksheetStyle(worksheet, rows.length + 1);
};

const createReportWorkbookBuffer = async ({ creator = "Codex", sheets }) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = creator;
  workbook.created = new Date();

  sheets.forEach((sheet) => addWorksheet(workbook, sheet));

  return workbook.xlsx.writeBuffer();
};

const createReportFileName = (fileBaseName) => `${fileBaseName}.xlsx`;

export { createReportWorkbookBuffer, createReportFileName, formatDateValue };
