const { StatusCodes: status } = require("http-status-codes");
const { apiResponse } = require("../utils/apiResponse.utils");
const { verifyToken } = require("../utils/jwt.utils");

module.exports = {
  authentication: async (req, res, next) => {
    try {
      const bearer = req.headers["authorization"];
      if (!bearer) throw apiResponse( status.UNAUTHORIZED, "UNAUTHORIZED", "Unauthorized. Please login to continue.");

      const token = bearer.split(' ')[1];
      if (!token) throw apiResponse( status.UNAUTHORIZED, 'UNAUTHORIZED', 'Unauthorized. Please login to continue.');

      req.user = verifyToken(token);

      next();
      
    } catch (e) {
      if (e.name === "JsonWebTokenError") {
        return res.status(status.UNAUTHORIZED).json(apiResponse( status.UNAUTHORIZED, "UNAUTHORIZED", "Invalid token. Please login again."));
      }
      if (e.name === "TokenExpiredError") {
        return res.status(status.UNAUTHORIZED).json(apiResponse( status.UNAUTHORIZED, "UNAUTHORIZED", "Token expired. Please login again."));
      }

      return res.status(e.code).json(e);
    }
  },
};
