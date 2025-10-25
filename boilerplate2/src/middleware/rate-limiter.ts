import rateLimit from "express-rate-limit";

// General rate limiter
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: {
            message: "Too many requests from this IP, please try again later.",
            code: "RATE_LIMIT_EXCEEDED",
        },
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiter for sensitive endpoints
export const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        success: false,
        error: {
            message: "Too many requests from this IP, please try again later.",
            code: "RATE_LIMIT_EXCEEDED",
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth rate limiter for login/register endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: {
        success: false,
        error: {
            message:
                "Too many authentication attempts, please try again later.",
            code: "AUTH_RATE_LIMIT_EXCEEDED",
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
