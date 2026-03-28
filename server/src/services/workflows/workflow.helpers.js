import { Prisma } from "@prisma/client";

import { buildServiceError } from "../../shared/crud/crud.helpers.js";

const TRANSACTION_OPTIONS = {
  isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
};

const toUniqueNumberList = (values = []) => {
  return Array.from(new Set(values.map((value) => Number(value))));
};

const ensureRecordExists = (record, message) => {
  if (!record) {
    throw buildServiceError(404, message);
  }

  return record;
};

const ensureAllRecordsFound = (records, ids, message) => {
  if (records.length !== ids.length) {
    throw buildServiceError(404, message);
  }

  return records;
};

const sumQuantityByField = (items = [], idField, quantityField) => {
  return items.reduce((result, item) => {
    const id = Number(item[idField]);
    const quantity = Number(item[quantityField]);

    result.set(id, (result.get(id) ?? 0) + quantity);
    return result;
  }, new Map());
};

export {
  ensureAllRecordsFound,
  ensureRecordExists,
  sumQuantityByField,
  toUniqueNumberList,
  TRANSACTION_OPTIONS,
};
