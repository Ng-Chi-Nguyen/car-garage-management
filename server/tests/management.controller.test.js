import test from "node:test";
import assert from "node:assert/strict";

const loadCreateCustomerController = async () => {
  const module = await import("../src/controllers/management/customer.controller.js");
  return module.createCustomerController;
};

const loadCreateCarBrandController = async () => {
  const module = await import("../src/controllers/management/carBrand.controller.js");
  return module.createCarBrandController;
};

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

test("customer controller ưu tiên req.validatedQuery và req.validatedParams", async () => {
  const createCustomerController = await loadCreateCustomerController();
  const received = [];
  const controller = createCustomerController({
    getCustomerList: async (query) => {
      received.push(["list", query]);
      return { customers: [] };
    },
    getCustomerById: async (id) => {
      received.push(["detail", id]);
      return { MaKH: id };
    },
    createCustomer: async () => ({ MaKH: 1 }),
    updateCustomer: async (id) => {
      received.push(["update", id]);
      return { MaKH: id };
    },
    deleteCustomer: async (id) => {
      received.push(["delete", id]);
      return { MaKH: id };
    },
  });

  await controller.getCustomerList(
    { query: { page: "2" }, validatedQuery: { page: 2 } },
    createMockRes(),
  );
  await controller.getCustomerById(
    { params: { id: "x" }, validatedParams: { id: 11 } },
    createMockRes(),
  );
  await controller.updateCustomer(
    { params: { id: "x" }, validatedParams: { id: 12 }, body: {} },
    createMockRes(),
  );
  await controller.deleteCustomer(
    { params: { id: "x" }, validatedParams: { id: 13 } },
    createMockRes(),
  );

  assert.deepEqual(received, [
    ["list", { page: 2 }],
    ["detail", 11],
    ["update", 12],
    ["delete", 13],
  ]);
});

test("carBrand controller ưu tiên req.validatedQuery và req.validatedParams", async () => {
  const createCarBrandController = await loadCreateCarBrandController();
  const received = [];
  const controller = createCarBrandController({
    getCarBrandList: async (query) => {
      received.push(["list", query]);
      return { carBrands: [] };
    },
    getCarBrandById: async (id) => {
      received.push(["detail", id]);
      return { MaHieuXe: id };
    },
    createCarBrand: async () => ({ MaHieuXe: 1 }),
    updateCarBrand: async (id) => {
      received.push(["update", id]);
      return { MaHieuXe: id };
    },
    deleteCarBrand: async (id) => {
      received.push(["delete", id]);
      return { MaHieuXe: id };
    },
  });

  await controller.getCarBrandList(
    { query: { page: "2" }, validatedQuery: { page: 2 } },
    createMockRes(),
  );
  await controller.getCarBrandById(
    { params: { id: "x" }, validatedParams: { id: 21 } },
    createMockRes(),
  );
  await controller.updateCarBrand(
    { params: { id: "x" }, validatedParams: { id: 22 }, body: {} },
    createMockRes(),
  );
  await controller.deleteCarBrand(
    { params: { id: "x" }, validatedParams: { id: 23 } },
    createMockRes(),
  );

  assert.deepEqual(received, [
    ["list", { page: 2 }],
    ["detail", 21],
    ["update", 22],
    ["delete", 23],
  ]);
});
