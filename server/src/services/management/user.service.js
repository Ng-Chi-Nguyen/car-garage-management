import prisma from '../../db/prisma.js';

const buildServiceError = (status, message) => {
    const error = new Error(message);
    error.status = status;

    return error;
};

const buildSearchCondition = (search) => {
    const keyword = search?.trim();

    if (!keyword) {
        return {};
    }

    return {
        OR: [
            {
                TenChuXe: {
                    contains: keyword,
                },
            },
            {
                DienThoai: {
                    contains: keyword,
                },
            },
            {
                DiaChi: {
                    contains: keyword,
                },
            },
        ],
    };
};

const buildUpdateData = (payload) => {
    return Object.fromEntries(
        Object.entries({
            TenChuXe: payload.TenChuXe,
            DienThoai: payload.DienThoai,
            DiaChi: payload.DiaChi,
        }).filter(([, value]) => value !== undefined),
    );
};

const userService = {
    createUser: async (payload) => {
        const user = await prisma.kHACH_HANG.create({
            data: {
                TenChuXe: payload.TenChuXe,
                DienThoai: payload.DienThoai,
                DiaChi: payload.DiaChi,
            },
        });

        return user;
    },
    getUsersAll: async ({ page = 1, limit = 10, search = '' }) => {
        const currentPage = Number(page);
        const pageSize = Number(limit);
        const skip = (currentPage - 1) * pageSize;
        const where = buildSearchCondition(search);

        const [totalItems, users] = await prisma.$transaction([
            prisma.kHACH_HANG.count({ where }),
            prisma.kHACH_HANG.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: {
                    MaKH: 'desc',
                },
            }),
        ]);

        return {
            users,
            pagination: {
                page: currentPage,
                limit: pageSize,
                totalItems,
                totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize),
            },
        };
    },
    getUserById: async (id) => {
        const user = await prisma.kHACH_HANG.findUnique({
            where: {
                MaKH: Number(id),
            },
        });

        if (!user) {
            throw buildServiceError(404, 'Không tìm thấy khách hàng.');
        }

        return user;
    },
    updateUser: async (id, payload) => {
        const existingUser = await prisma.kHACH_HANG.findUnique({
            where: {
                MaKH: Number(id),
            },
        });

        if (!existingUser) {
            throw buildServiceError(404, 'Không tìm thấy khách hàng.');
        }

        const updateData = buildUpdateData(payload);

        const user = await prisma.kHACH_HANG.update({
            where: {
                MaKH: Number(id),
            },
            data: updateData,
        });

        return user;
    },
    deleteUser: async (id) => {
        const existingUser = await prisma.kHACH_HANG.findUnique({
            where: {
                MaKH: Number(id),
            },
        });

        if (!existingUser) {
            throw buildServiceError(404, 'Không tìm thấy khách hàng.');
        }

        const user = await prisma.kHACH_HANG.delete({
            where: {
                MaKH: Number(id),
            },
        });

        return user;
    },
};

export default userService;
