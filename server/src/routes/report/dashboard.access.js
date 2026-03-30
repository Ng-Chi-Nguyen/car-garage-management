import rateLimit from "express-rate-limit";

import authMiddleware from "../../middleware/auth/auth.middleware.js";

const managementRoles = ["Admin", "NhanVien"];
const defaultDashboardRateLimitMessage =
  "Bạn đang gửi quá nhiều yêu cầu đến dashboard. Vui lòng thử lại sau.";

const resolveDashboardRateLimitMax = () => {
  const configuredMax = Number(process.env.DASHBOARD_RATE_LIMIT_MAX);

  if (Number.isInteger(configuredMax) && configuredMax > 0) {
    return configuredMax;
  }

  return 60;
};

const createDashboardRateLimiter = (options = {}) =>
  rateLimit({
    windowMs: 60_000,
    max: resolveDashboardRateLimitMax(),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: defaultDashboardRateLimitMessage,
    },
    ...options,
  });

const createDashboardAccessMiddlewares = ({
  auth = authMiddleware,
  rateLimitOptions = {},
} = {}) => [
  createDashboardRateLimiter(rateLimitOptions),
  auth.requireAuth,
  auth.requireRoles(managementRoles),
];

const dashboardAccessMiddlewares = createDashboardAccessMiddlewares();

export {
  managementRoles,
  createDashboardAccessMiddlewares,
  createDashboardRateLimiter,
  dashboardAccessMiddlewares,
};
