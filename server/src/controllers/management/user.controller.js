import userService from '../../services/management/user.service.js';

const handleError = (res, error) => {
    if (error?.code === 'P2025') {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy khách hàng.',
        });
    }

    if (error?.code === 'P2003') {
        return res.status(409).json({
            success: false,
            message: 'Không thể xóa khách hàng vì đang có dữ liệu liên quan.',
        });
    }

    return res.status(error?.status || 500).json({
        success: false,
        message: error?.message || 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu.',
    });
};

const userController = {
    createUser: async (req, res) => {
        try {
            const user = await userService.createUser(req.body);

            return res.status(201).json({
                success: true,
                message: 'Tạo khách hàng thành công.',
                data: { user },
            });
        } catch (error) {
            return handleError(res, error);
        }
    },
    getUsersAll: async (req, res) => {
        try {
            const result = await userService.getUsersAll(req.query);

            return res.json({
                success: true,
                message: 'Lấy danh sách khách hàng thành công.',
                data: result,
            });
        } catch (error) {
            return handleError(res, error);
        }
    },
    getUserById: async (req, res) => {
        try {
            const user = await userService.getUserById(req.params.id);

            return res.json({
                success: true,
                message: 'Lấy thông tin khách hàng thành công.',
                data: { user },
            });
        } catch (error) {
            return handleError(res, error);
        }
    },
    updateUser: async (req, res) => {
        try {
            const user = await userService.updateUser(req.params.id, req.body);

            return res.json({
                success: true,
                message: 'Cập nhật khách hàng thành công.',
                data: { user },
            });
        } catch (error) {
            return handleError(res, error);
        }
    },
    deleteUser: async (req, res) => {
        try {
            const user = await userService.deleteUser(req.params.id);

            return res.json({
                success: true,
                message: 'Xóa khách hàng thành công.',
                data: { user },
            });
        } catch (error) {
            return handleError(res, error);
        }
    },
};

export default userController;
