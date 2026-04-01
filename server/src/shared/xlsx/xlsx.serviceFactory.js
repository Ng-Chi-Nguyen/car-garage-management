import ExcelJS from "exceljs";
import Joi from "joi";

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
      const numberValue = Number(trimmedValue);
      if (Number.isNaN(numberValue)) {
        return trimmedValue;
      }
      return numberValue;
    }

    return trimmedValue;
  }

  if (type === "number") {
    const numberValue = Number(primitiveValue);
    return Number.isNaN(numberValue) ? primitiveValue : numberValue;
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
  const columnIndexByKey = new Map();

  headerRow.eachCell((cell, columnNumber) => {
    columnIndexByKey.set(normalizeHeader(cell.value), columnNumber);
  });

  const missingHeaders = columns
    .map((column) => column.header)
    .filter((header) => !columnIndexByKey.has(normalizeHeader(header)));

  if (missingHeaders.length > 0) {
    throw buildServiceError(
      400,
      `File .xlsx thiếu cột bắt buộc: ${missingHeaders.join(", ")}.`,
    );
  }

  const rows = [];

  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const worksheetRow = worksheet.getRow(rowNumber);
    const rowData = {};

    columns.forEach((column) => {
      const columnIndex = columnIndexByKey.get(normalizeHeader(column.header));
      rowData[column.key] = convertCellValue(worksheetRow.getCell(columnIndex).value, column.type);
    });

    if (!isRowEmpty(rowData)) {
      rows.push({ rowNumber, values: rowData });
    }
  }

  if (rows.length === 0) {
    throw buildServiceError(400, "File .xlsx không có dòng dữ liệu hợp lệ.");
  }

  return rows;
};

const applyWorksheetStyle = (worksheet, columns, rowCount = 1) => {
  worksheet.columns = columns.map((column) => ({
    header: column.header,
    key: column.key,
    width: column.width ?? 18,
    style: column.style ?? {},
  }));

  worksheet.autoFilter = {
    from: "A1",
    to: `${worksheet.getRow(1).lastCell.address}`,
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

    if (rowNumber % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = ALT_ROW_FILL;
      });
    }

    row.eachCell((cell) => {
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

const createWorkbookBuffer = async ({ sheetName, columns, rows = [] }) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Codex";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(sheetName, {
    properties: {
      tabColor: { argb: "FF5B9BD5" },
    },
  });

  applyWorksheetStyle(worksheet, columns, rows.length + 1);

  rows.forEach((row) => {
    const worksheetRow = worksheet.addRow(
      Object.fromEntries(
        columns.map((column) => [column.key, escapeWorkbookText(row[column.key] ?? "")]),
      ),
    );

    columns.forEach((column, index) => {
      const cell = worksheetRow.getCell(index + 1);

      if (column.numFmt) {
        cell.numFmt = column.numFmt;
      }
    });
  });

  return workbook.xlsx.writeBuffer();
};

const validateWithSchema = ({ schema, rowData, rowNumber, entityLabel, actionLabel }) => {
  const { error, value } = schema.validate(rowData, {
    abortEarly: false,
    allowUnknown: false,
    convert: true,
  });

  if (error) {
    const detailMessage = error.details.map((detail) => detail.message.replace(/['"]/g, "")).join("; ");
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
  exportRows = (rows) => rows,
  orderByField = idField,
  prismaClient = prisma,
}) => {
  const getDelegate = (client = prismaClient) => client[delegateName];
  const idColumn = columns.find((column) => column.key === idField);
  const writableColumns = columns.filter((column) => column.key !== idField);

  if (!idColumn) {
    throw new Error(`Missing id column for ${entityLabel}.`);
  }

  const createTemplateBuffer = async () =>
    createWorkbookBuffer({
      sheetName,
      columns,
    });

  const exportDataBuffer = async () => {
    const rows = await getDelegate().findMany({
      orderBy: {
        [orderByField]: "desc",
      },
    });

    return createWorkbookBuffer({
      sheetName,
      columns,
      rows: exportRows(rows),
    });
  };

  const importRows = async (file) => {
    const rows = await parseWorksheetRows({
      buffer: file.buffer,
      sheetName,
      columns,
    });

    const preparedRows = rows.map(({ rowNumber, values }) => {
      if (values[idField] !== undefined) {
        throw buildServiceError(
          400,
          formatRowError({
            rowNumber,
            entityLabel,
            actionLabel: "Import",
            message: `${idColumn.header} phải để trống khi tạo mới.`,
          }),
        );
      }

      const createPayload = Object.fromEntries(
        writableColumns.map((column) => [column.key, values[column.key]]),
      );

      const validatedPayload = validateWithSchema({
        schema: createSchema,
        rowData: createPayload,
        rowNumber,
        entityLabel,
        actionLabel: "Import",
      });

      return { rowNumber, payload: validatedPayload };
    });

    try {
      const createdCount = await prismaClient.$transaction(async (tx) => {
        const delegate = getDelegate(tx);

        for (const row of preparedRows) {
          await delegate.create({
            data: row.payload,
          });
        }

        return preparedRows.length;
      });

      return {
        entity: entityLabel,
        createdCount,
        updatedCount: 0,
      };
    } catch (error) {
      const rowNumber = preparedRows.find((row) => true)?.rowNumber ?? 2;
      throw buildServiceError(
        error?.status || 400,
        formatRowError({
          rowNumber,
          entityLabel,
          actionLabel: "Import",
          message: mapPrismaErrorMessage(error, "Không thể tạo dữ liệu từ file .xlsx."),
        }),
      );
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

      const updatePayload = Object.fromEntries(
        writableColumns.map((column) => [column.key, values[column.key]]),
      );

      const validatedPayload = validateWithSchema({
        schema: updateSchema,
        rowData: updatePayload,
        rowNumber,
        entityLabel,
        actionLabel: "Cập nhật",
      });

      return {
        rowNumber,
        id: numericId,
        payload: validatedPayload,
      };
    });

    try {
      const updatedCount = await prismaClient.$transaction(async (tx) => {
        const delegate = getDelegate(tx);

        for (const row of preparedRows) {
          await delegate.update({
            where: {
              [idField]: row.id,
            },
            data: row.payload,
          });
        }

        return preparedRows.length;
      });

      return {
        entity: entityLabel,
        createdCount: 0,
        updatedCount,
      };
    } catch (error) {
      const rowNumber = preparedRows.find((row) => true)?.rowNumber ?? 2;
      throw buildServiceError(
        error?.status || 400,
        formatRowError({
          rowNumber,
          entityLabel,
          actionLabel: "Cập nhật",
          message: mapPrismaErrorMessage(error, "Không thể cập nhật dữ liệu từ file .xlsx."),
        }),
      );
    }
  };

  return {
    fileBaseName,
    createTemplateBuffer,
    exportDataBuffer,
    importRows,
    updateRows,
  };
};

const createXlsxFileName = (fileBaseName, type) => `${fileBaseName}-${type}.xlsx`;

const buildRowSchema = (schema) => Joi.object(schema.describe().keys).unknown(false);

export { buildRowSchema, createXlsxFileName, createXlsxService };
