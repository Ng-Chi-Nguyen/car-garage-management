import ExcelJS from "exceljs";

import prisma from "../../db/prisma.js";
import { buildServiceError } from "../crud/crud.helpers.js";

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

const TEMPLATE_VALIDATION_MAX_ROW = 10000;

const normalizeHeader = (value) => String(value ?? "").trim().toLowerCase();

const isRowEmpty = (row) =>
  Object.values(row).every((value) => value === undefined || value === null || value === "");

const escapeWorkbookText = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return /^[=+\-@]/.test(value) ? `'${value}` : value;
};

const getPrimitiveCellValue = (value) => {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "object") {
    if (value instanceof Date) {
      return value;
    }

    if ("text" in value) {
      return value.text;
    }

    if ("result" in value) {
      return value.result;
    }

    if ("hyperlink" in value) {
      return value.text ?? value.hyperlink;
    }

    if ("richText" in value && Array.isArray(value.richText)) {
      return value.richText.map((item) => item.text).join("");
    }
  }

  return value;
};

const parseFlexibleNumber = (value) => {
  if (typeof value === "number") {
    return Number.isNaN(value) ? undefined : value;
  }

  if (typeof value !== "string") {
    const numericValue = Number(value);
    return Number.isNaN(numericValue) ? undefined : numericValue;
  }

  const trimmedValue = value.trim();

  if (trimmedValue === "") {
    return undefined;
  }

  const unquotedValue =
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
    (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
      ? trimmedValue.slice(1, -1).trim()
      : trimmedValue;

  const prefixedNumberMatch = unquotedValue.match(/^([+-]?\d+(?:[.,]\d+)?)\s*[-:|].+$/);
  if (prefixedNumberMatch) {
    return parseFlexibleNumber(prefixedNumberMatch[1]);
  }

  const normalizedValue = unquotedValue.replace(/\s+/g, "");
  const commaCount = (normalizedValue.match(/,/g) || []).length;
  const dotCount = (normalizedValue.match(/\./g) || []).length;

  if (commaCount > 0 && dotCount > 0) {
    const lastCommaIndex = normalizedValue.lastIndexOf(",");
    const lastDotIndex = normalizedValue.lastIndexOf(".");

    if (lastCommaIndex > lastDotIndex) {
      const convertedValue = normalizedValue.replace(/\./g, "").replace(",", ".");
      const numericValue = Number(convertedValue);
      return Number.isNaN(numericValue) ? undefined : numericValue;
    }

    const convertedValue = normalizedValue.replace(/,/g, "");
    const numericValue = Number(convertedValue);
    return Number.isNaN(numericValue) ? undefined : numericValue;
  }

  if (commaCount > 0) {
    if (commaCount === 1) {
      const [leftPart, rightPart] = normalizedValue.split(",");

      if (rightPart.length === 3 && leftPart.length > 0) {
        const numericValue = Number(leftPart + rightPart);
        return Number.isNaN(numericValue) ? undefined : numericValue;
      }

      const numericValue = Number(`${leftPart}.${rightPart}`);
      return Number.isNaN(numericValue) ? undefined : numericValue;
    }

    const numericValue = Number(normalizedValue.replace(/,/g, ""));
    return Number.isNaN(numericValue) ? undefined : numericValue;
  }

  if (dotCount > 0) {
    if (dotCount === 1) {
      const [leftPart, rightPart] = normalizedValue.split(".");

      if (rightPart.length === 3 && leftPart.length > 0) {
        const numericValue = Number(leftPart + rightPart);
        return Number.isNaN(numericValue) ? undefined : numericValue;
      }
    }

    const numericValue = Number(normalizedValue);
    return Number.isNaN(numericValue) ? undefined : numericValue;
  }

  const numericValue = Number(normalizedValue);
  return Number.isNaN(numericValue) ? undefined : numericValue;
};

const convertCellValue = (value, type) => {
  const primitiveValue = getPrimitiveCellValue(value);

  if (primitiveValue === undefined || primitiveValue === null) {
    return undefined;
  }

  if (typeof primitiveValue === "string") {
    const trimmedValue = primitiveValue.trim();

    if (trimmedValue === "") {
      return undefined;
    }

    if (type === "number") {
      const numberValue = parseFlexibleNumber(trimmedValue);
      return numberValue === undefined ? trimmedValue : numberValue;
    }

    return trimmedValue;
  }

  if (type === "number") {
    const numberValue = parseFlexibleNumber(primitiveValue);
    return numberValue === undefined ? primitiveValue : numberValue;
  }

  return primitiveValue;
};

const formatRowError = ({ rowNumber, entityLabel, actionLabel, message }) =>
  `${actionLabel} ${entityLabel} thất bại tại dòng ${rowNumber}: ${message}`;

const mapPrismaErrorMessage = (error, defaultMessage) => {
  if (error?.code === "P2002") {
    return "Dữ liệu bị trùng với bản ghi đã tồn tại.";
  }

  if (error?.code === "P2003") {
    return "Dữ liệu liên kết không hợp lệ.";
  }

  if (error?.code === "P2025") {
    return "Không tìm thấy bản ghi cần cập nhật.";
  }

  return error?.message || defaultMessage;
};

const parseWorksheetRows = async ({ buffer, sheetName, columns }) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.getWorksheet(sheetName) ?? workbook.worksheets[0];

  if (!worksheet) {
    throw buildServiceError(400, "File .xlsx không có sheet dữ liệu.");
  }

  const headerRow = worksheet.getRow(1);
  const columnIndexByHeader = new Map();

  headerRow.eachCell((cell, columnNumber) => {
    columnIndexByHeader.set(normalizeHeader(cell.value), columnNumber);
  });

  const missingHeaders = columns
    .map((column) => column.header)
    .filter((header) => !columnIndexByHeader.has(normalizeHeader(header)));

  if (missingHeaders.length > 0) {
    throw buildServiceError(
      400,
      `File .xlsx thiếu cột bắt buộc: ${missingHeaders.join(", ")}.`,
    );
  }

  const rows = [];

  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const worksheetRow = worksheet.getRow(rowNumber);
    const rowValues = {};

    columns.forEach((column) => {
      const columnIndex = columnIndexByHeader.get(normalizeHeader(column.header));
      rowValues[column.key] = convertCellValue(
        worksheetRow.getCell(columnIndex).value,
        column.type,
      );
    });

    if (!isRowEmpty(rowValues)) {
      rows.push({ rowNumber, values: rowValues });
    }
  }

  if (rows.length === 0) {
    throw buildServiceError(400, "File .xlsx không có dòng dữ liệu hợp lệ.");
  }

  return rows;
};

const applyWorksheetStyle = (worksheet, rowCount) => {
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
    cell.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
    };
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
      cell.alignment = {
        vertical: "middle",
      };
    });
  }
};

const applyWorksheetValidations = (worksheet, columns) => {
  const maxRow = TEMPLATE_VALIDATION_MAX_ROW;

  columns.forEach((column, index) => {
    if (!column.validation?.type) {
      return;
    }

    const columnLetter = worksheet.getColumn(index + 1).letter;

    for (let rowNumber = 2; rowNumber <= maxRow; rowNumber += 1) {
      worksheet.getCell(`${columnLetter}${rowNumber}`).dataValidation = {
        allowBlank: true,
        showInputMessage: true,
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Gia tri khong hop le",
        error:
          column.validation.error ||
          `Vui long chon gia tri hop le cho cot ${column.header}.`,
        promptTitle: column.header,
        prompt:
          column.validation.prompt ||
          `Hay chon mot gia tri trong danh sach cho cot ${column.header}.`,
        ...column.validation,
      };
    }
  });
};

const createWorkbookBuffer = async ({
  sheetName,
  columns,
  rows = [],
  prepareWorkbook,
  includeValidations = true,
}) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Codex";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(sheetName, {
    properties: {
      tabColor: { argb: "FF5B9BD5" },
    },
  });

  worksheet.columns = columns.map((column) => ({
    header: column.header,
    key: column.key,
    width: column.width ?? 18,
  }));

  columns.forEach((column, index) => {
    if (column.numFmt) {
      worksheet.getColumn(index + 1).numFmt = column.numFmt;
    }
  });

  rows.forEach((row) => {
    const worksheetRow = worksheet.addRow(
      Object.fromEntries(
        columns.map((column) => [column.key, escapeWorkbookText(row[column.key] ?? "")]),
      ),
    );

    columns.forEach((column, index) => {
      if (column.numFmt) {
        worksheetRow.getCell(index + 1).numFmt = column.numFmt;
      }
    });
  });

  applyWorksheetStyle(worksheet, rows.length + 1);

  if (includeValidations) {
    applyWorksheetValidations(worksheet, columns);
  }

  if (prepareWorkbook) {
    await prepareWorkbook({
      workbook,
      worksheet,
      columns,
      rows,
    });
  }

  return workbook.xlsx.writeBuffer();
};

const validateWithSchema = ({ schema, rowData, rowNumber, entityLabel, actionLabel }) => {
  const { error, value } = schema.validate(rowData, {
    abortEarly: false,
    allowUnknown: false,
    convert: true,
  });

  if (error) {
    const detailMessage = error.details
      .map((detail) => detail.message.replace(/['"]/g, ""))
      .join("; ");

    throw buildServiceError(
      400,
      formatRowError({
        rowNumber,
        entityLabel,
        actionLabel,
        message: detailMessage,
      }),
    );
  }

  return value;
};

const createXlsxService = ({
  entityLabel,
  fileBaseName,
  sheetName,
  delegateName,
  idField,
  columns,
  createSchema,
  updateSchema,
  fetchRows,
  exportRows = (rows) => rows,
  orderByField = idField,
  prepareWorkbook,
  beforeCreate = (payload) => payload,
  beforeUpdate = (payload) => payload,
  prismaClient = prisma,
}) => {
  const getDelegate = (client = prismaClient) => client[delegateName];
  const idColumn = columns.find((column) => column.key === idField);
  const writableColumns = columns.filter(
    (column) => column.key !== idField && column.writable !== false,
  );

  if (!idColumn) {
    throw new Error(`Missing id column for ${entityLabel}.`);
  }

  const createTemplateBuffer = async () => {
    const rows = fetchRows
      ? await fetchRows(prismaClient)
      : await getDelegate().findMany({
          orderBy: {
            [orderByField]: "desc",
          },
        });

    return createWorkbookBuffer({
      sheetName,
      columns,
      rows: exportRows(rows),
      prepareWorkbook,
      includeValidations: true,
    });
  };

  const exportDataBuffer = async () => {
    const rows = fetchRows
      ? await fetchRows(prismaClient)
      : await getDelegate().findMany({
          orderBy: {
            [orderByField]: "desc",
          },
        });

    return createWorkbookBuffer({
      sheetName,
      columns,
      rows: exportRows(rows),
      prepareWorkbook,
      includeValidations: false,
    });
  };

  const importRows = async (file) => {
    const rows = await parseWorksheetRows({
      buffer: file.buffer,
      sheetName,
      columns,
    });
    let skippedCount = 0;

    const preparedRows = rows.flatMap(({ rowNumber, values }) => {
      if (values[idField] !== undefined) {
        skippedCount += 1;
        return [];
      }

      const payload = Object.fromEntries(
        writableColumns.map((column) => [column.key, values[column.key]]),
      );

      return {
        rowNumber,
        payload: beforeCreate(
          validateWithSchema({
            schema: createSchema,
            rowData: payload,
            rowNumber,
            entityLabel,
            actionLabel: "Import",
          }),
        ),
      };
    });

    try {
      const createdCount = await prismaClient.$transaction(async (tx) => {
        const delegate = getDelegate(tx);

        for (const row of preparedRows) {
          try {
            await delegate.create({
              data: row.payload,
            });
          } catch (error) {
            throw buildServiceError(
              400,
              formatRowError({
                rowNumber: row.rowNumber,
                entityLabel,
                actionLabel: "Import",
                message: mapPrismaErrorMessage(error, "Không thể tạo dữ liệu từ file .xlsx."),
              }),
            );
          }
        }

        return preparedRows.length;
      });

      return {
        entity: entityLabel,
        createdCount,
        updatedCount: 0,
        skippedCount,
      };
    } catch (error) {
      throw buildServiceError(error?.status || 400, error?.message || "Không thể import file .xlsx.");
    }
  };

  const updateRows = async (file) => {
    const rows = await parseWorksheetRows({
      buffer: file.buffer,
      sheetName,
      columns,
    });
    const seenIds = new Set();

    const preparedRows = rows.map(({ rowNumber, values }) => {
      const rawId = values[idField];

      if (rawId === undefined) {
        throw buildServiceError(
          400,
          formatRowError({
            rowNumber,
            entityLabel,
            actionLabel: "Cập nhật",
            message: `${idColumn.header} là bắt buộc.`,
          }),
        );
      }

      const numericId = Number(rawId);

      if (!Number.isInteger(numericId) || numericId <= 0) {
        throw buildServiceError(
          400,
          formatRowError({
            rowNumber,
            entityLabel,
            actionLabel: "Cập nhật",
            message: `${idColumn.header} phải là số nguyên dương.`,
          }),
        );
      }

      if (seenIds.has(numericId)) {
        throw buildServiceError(
          400,
          formatRowError({
            rowNumber,
            entityLabel,
            actionLabel: "Cập nhật",
            message: `${idColumn.header} bị trùng trong file.`,
          }),
        );
      }
      seenIds.add(numericId);

      const payload = Object.fromEntries(
        writableColumns.map((column) => [column.key, values[column.key]]),
      );

      return {
        rowNumber,
        id: numericId,
        payload: beforeUpdate(
          validateWithSchema({
            schema: updateSchema,
            rowData: payload,
            rowNumber,
            entityLabel,
            actionLabel: "Cập nhật",
          }),
        ),
      };
    });

    try {
      const updatedCount = await prismaClient.$transaction(async (tx) => {
        const delegate = getDelegate(tx);

        for (const row of preparedRows) {
          try {
            await delegate.update({
              where: {
                [idField]: row.id,
              },
              data: row.payload,
            });
          } catch (error) {
            throw buildServiceError(
              400,
              formatRowError({
                rowNumber: row.rowNumber,
                entityLabel,
                actionLabel: "Cập nhật",
                message: mapPrismaErrorMessage(error, "Không thể cập nhật dữ liệu từ file .xlsx."),
              }),
            );
          }
        }

        return preparedRows.length;
      });

      return {
        entity: entityLabel,
        createdCount: 0,
        updatedCount,
      };
    } catch (error) {
      throw buildServiceError(
        error?.status || 400,
        error?.message || "Không thể cập nhật file .xlsx.",
      );
    }
  };

  const syncRows = async (file) => {
    const rows = await parseWorksheetRows({
      buffer: file.buffer,
      sheetName,
      columns,
    });
    const seenIds = new Set();

    const preparedRows = rows.map(({ rowNumber, values }) => {
      const rawId = values[idField];
      const payload = Object.fromEntries(
        writableColumns.map((column) => [column.key, values[column.key]]),
      );

      if (rawId === undefined) {
        return {
          rowNumber,
          mode: "create",
          payload: beforeCreate(
            validateWithSchema({
              schema: createSchema,
              rowData: payload,
              rowNumber,
              entityLabel,
              actionLabel: "Đồng bộ",
            }),
          ),
        };
      }

      const numericId = Number(rawId);

      if (!Number.isInteger(numericId) || numericId <= 0) {
        throw buildServiceError(
          400,
          formatRowError({
            rowNumber,
            entityLabel,
            actionLabel: "Đồng bộ",
            message: `${idColumn.header} phải là số nguyên dương hoặc để trống.`,
          }),
        );
      }

      if (seenIds.has(numericId)) {
        throw buildServiceError(
          400,
          formatRowError({
            rowNumber,
            entityLabel,
            actionLabel: "Đồng bộ",
            message: `${idColumn.header} bị trùng trong file.`,
          }),
        );
      }
      seenIds.add(numericId);

      return {
        rowNumber,
        mode: "update",
        id: numericId,
        payload: beforeUpdate(
          validateWithSchema({
            schema: updateSchema,
            rowData: payload,
            rowNumber,
            entityLabel,
            actionLabel: "Đồng bộ",
          }),
        ),
      };
    });

    let createdCount = 0;
    let updatedCount = 0;

    try {
      await prismaClient.$transaction(async (tx) => {
        const delegate = getDelegate(tx);

        for (const row of preparedRows) {
          try {
            if (row.mode === "create") {
              await delegate.create({
                data: row.payload,
              });
              createdCount += 1;
              continue;
            }

            await delegate.update({
              where: {
                [idField]: row.id,
              },
              data: row.payload,
            });
            updatedCount += 1;
          } catch (error) {
            throw buildServiceError(
              400,
              formatRowError({
                rowNumber: row.rowNumber,
                entityLabel,
                actionLabel: "Đồng bộ",
                message: mapPrismaErrorMessage(error, "Không thể đồng bộ dữ liệu từ file .xlsx."),
              }),
            );
          }
        }
      });

      return {
        entity: entityLabel,
        createdCount,
        updatedCount,
      };
    } catch (error) {
      throw buildServiceError(
        error?.status || 400,
        error?.message || "Không thể đồng bộ file .xlsx.",
      );
    }
  };

  return {
    fileBaseName,
    createTemplateBuffer,
    exportDataBuffer,
    importRows,
    syncRows,
    updateRows,
  };
};

const createXlsxFileName = (fileBaseName, type) => `${fileBaseName}-${type}.xlsx`;

export { createXlsxFileName, createXlsxService };
