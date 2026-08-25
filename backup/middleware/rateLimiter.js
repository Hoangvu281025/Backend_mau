import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 5, // giới hạn mỗi IP chỉ được phép đăng nhập 5 lần trong khoảng thời gian này
    message: { message: "Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau 15 phút" },
    standardHeaders: true, // trả về thông tin giới hạn trong header `RateLimit-*`
    legacyHeaders: false, // không sử dụng header `X-RateLimit-*`
});