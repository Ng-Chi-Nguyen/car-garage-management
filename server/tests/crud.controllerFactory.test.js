import test from "node:test";
import assert from "node:assert/strict";

import createCrudController from "../src/shared/crud/crud.controllerFactory.js";

const createMockRes = () => ({
  statusCode: 200,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.body = payload;
    return this;
  },
});

const messages = {
  createSuccess: "ok",
  listSuccess: "ok",
  detailSuccess: "ok",
  updateSuccess: "ok",
  deleteSuccess: "ok",
  notFound: "nf",
  relatedData: "rd",
  duplicate: "dup",
};

test("crud controller getAll ưu tiên req.validatedQuery", async () => {
  let receivedQuery = null;
  const controller = createCrudController({
    service: {
      create: async () => ({}),
      getAll: async (query) => {
        receivedQuery = query;
        return { items: [] };
      },
      getById: async () => ({}),
      update: async () => ({}),
      remove: async () => ({}),
    },
    entityKey: "item",
    messages,
  });

  await controller.getAll({ query: { page: "2" }, validatedQuery: { page: 2 } }, createMockRes());

  assert.deepEqual(receivedQuery, { page: 2 });
});

test("crud controller getById và update ưu tiên req.validatedParams", async () => {
  const received = [];
  const controller = createCrudController({
    service: {
      create: async () => ({}),
      getAll: async () => ({ items: [] }),
      getById: async (id) => {
        received.push(["getById", id]);
        return { id };
      },
      update: async (id) => {
        received.push(["update", id]);
        return { id };
      },
      remove: async (id) => {
        received.push(["remove", id]);
        return { id };
      },
    },
    entityKey: "item",
    messages,
  });

  await controller.getById({ params: { id: "x" }, validatedParams: { id: 12 } }, createMockRes());
  await controller.update({ params: { id: "x" }, validatedParams: { id: 34 }, body: {} }, createMockRes());
  await controller.remove({ params: { id: "x" }, validatedParams: { id: 56 } }, createMockRes());

  assert.deepEqual(received, [["getById", 12], ["update", 34], ["remove", 56]]);
});
