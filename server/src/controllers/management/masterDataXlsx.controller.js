import { createXlsxFileName } from "../../shared/xlsx/xlsx.service.js";
import masterDataXlsxService from "../../services/management/masterDataXlsxV2.service.js";

const sendWorkbook = (res, buffer, fileName) => {
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.send(Buffer.from(buffer));
};

const createMasterDataXlsxController = (service = masterDataXlsxService) => ({
  downloadTemplate: async (req, res) => {
    try {
      const entity = req.validatedParams?.entity ?? req.params.entity;
      const { fileBaseName, buffer } = await service.downloadTemplate(entity);

      sendWorkbook(res, buffer, createXlsxFileName(fileBaseName, "template"));
    } catch (error) {
      res.status(error?.status || 500).json({
        success: false,
        message: error?.message || "Không thể tạo file mẫu .xlsx.",
      });
    }
  },

  exportData: async (req, res) => {
    try {
      const entity = req.validatedParams?.entity ?? req.params.entity;
      const { fileBaseName, buffer } = await service.exportData(entity);

      sendWorkbook(res, buffer, createXlsxFileName(fileBaseName, "export"));
    } catch (error) {
      res.status(error?.status || 500).json({
        success: false,
        message: error?.message || "Không thể xuất file .xlsx.",
      });
    }
  },

  importData: async (req, res) => {
    try {
      const entity = req.validatedParams?.entity ?? req.params.entity;
      const result = await service.importData(entity, req.file);

      res.status(201).json({
        success: true,
        message: `Import ${result.entity} bằng file .xlsx thành công.`,
        data: result,
      });
    } catch (error) {
      res.status(error?.status || 500).json({
        success: false,
        message: error?.message || "Không thể import file .xlsx.",
      });
    }
  },

  syncData: async (req, res) => {
    try {
      const entity = req.validatedParams?.entity ?? req.params.entity;
      const result = await service.syncData(entity, req.file);

      res.json({
        success: true,
        message: `Đồng bộ ${result.entity} bằng file .xlsx thành công.`,
        data: result,
      });
    } catch (error) {
      res.status(error?.status || 500).json({
        success: false,
        message: error?.message || "Không thể đồng bộ bằng file .xlsx.",
      });
    }
  },

  updateData: async (req, res) => {
    try {
      const entity = req.validatedParams?.entity ?? req.params.entity;
      const result = await service.updateData(entity, req.file);

      res.json({
        success: true,
        message: `Cập nhật ${result.entity} bằng file .xlsx thành công.`,
        data: result,
      });
    } catch (error) {
      res.status(error?.status || 500).json({
        success: false,
        message: error?.message || "Không thể cập nhật bằng file .xlsx.",
      });
    }
  },
});

const masterDataXlsxController = createMasterDataXlsxController();

export { createMasterDataXlsxController };
export default masterDataXlsxController;
