const rateLimit = require('express-rate-limit');
const { StatusCodes: status } = require('http-status-codes');
const { apiTooManyRequestResponse } = require("../utils/apiResponse.utils");

module.exports = {
    limiter: rateLimit({
        windowMs: 3 * 60 * 1000,
        max: 1000,
        handler: (req, res, next) => {
            return res.status(status.TOO_MANY_REQUESTS).json(apiTooManyRequestResponse('Too many requests, please try again later.'));
        }
    }),
    loginLimit: rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 3,
        handler: (req, res, next) => {
            return res.status(status.TOO_MANY_REQUESTS).json(apiTooManyRequestResponse('Too many requests from this IP, please try again after 3 minutes'));
        }
    }),
};
