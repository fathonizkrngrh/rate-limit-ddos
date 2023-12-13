const rateLimit = require('express-rate-limit');
const { StatusCodes: status } = require('http-status-codes');
const { apiTooManyRequestResponse } = require("../utils/apiResponse.utils");

module.exports = {
    limiter: rateLimit({
        windowMs: 3 * 60 * 1000, // 3 minutes
        max: 1000, // limit each IP to 1000 requests per windowMs
        handler: (req, res, next) => {
            return res.status(status.TOO_MANY_REQUESTS).json(apiTooManyRequestResponse('Too many requests, please try again later.'));
        }
    }),
    emailVerificationLimit: rateLimit({
        windowMs: 3 * 60 * 1000,
        max: 3,
        handler: (req, res, next) => {
            return res.status(status.TOO_MANY_REQUESTS).json(apiTooManyRequestResponse('Too many requests from this IP, please try again after 3 minutes'));
        }
    }),
    passwordResetLimit: rateLimit({
        windowMs: 3 * 60 * 1000,
        max: 3,
        handler: (req, res, next) => {
            return res.status(status.TOO_MANY_REQUESTS).json(apiTooManyRequestResponse('Too many requests from this IP, please try again after 3 minutes'));
        }
    }),
};
