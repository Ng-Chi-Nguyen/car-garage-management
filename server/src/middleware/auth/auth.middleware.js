import jwt from "jsonwebtoken";

const unauthorized = (res, message = "Bạn chưa đăng nhập hoặc phiên đăng nhập không hợp lệ.") =>
  res.status(401).json({
    success: false,
    message,
  });

const forbidden = (res, message = "Bạn không có quyền truy cập tài nguyên này.") =>
  res.status(403).json({
    success: false,
    message,
  });

const extractBearerToken = (authorizationHeader = "") => {
  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

const isTemporaryAuthBypassEnabled = () => {
  const nodeEnv = process.env.NODE_ENV;
  const bypassEnv = process.env.AUTH_BYPASS;

  if (bypassEnv === "true") {
    return true;
  }

  if (bypassEnv === "false") {
    return false;
  }

  return nodeEnv !== "production" && nodeEnv !== "test";
};

const requireAuth = (req, res, next) => {
  if (isTemporaryAuthBypassEnabled()) {
    req.user = {
      MaNV: 0,
      ChucVu: "Admin",
      HoTen: "DEV_AUTH_BYPASS",
    };
    return next();
  }

  const token = extractBearerToken(req.headers?.authorization);

  if (!token) {
    return unauthorized(res);
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return unauthorized(res);
  }
};

const requireRoles = (roles = []) => (req, res, next) => {
  if (isTemporaryAuthBypassEnabled()) {
    return next();
  }

  if (!req.user) {
    return unauthorized(res);
  }

  if (!roles.includes(req.user.ChucVu)) {
    return forbidden(res);
  }

  return next();
};

const authMiddleware = {
  requireAuth,
  requireRoles,
};

export default authMiddleware;
