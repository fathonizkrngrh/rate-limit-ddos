const models = require("../models");
const tUser = models.users;
const { StatusCodes: status } = require("http-status-codes");
const { apiResponse, apiBadRequestResponse } = require("../utils/apiResponse.utils");
const { hashPassword, checkPassword } = require("../utils/bcrypt.utils");
const { generateToken } = require("../utils/jwt.utils");

module.exports = {
  register: async (req) => {
    try {
      const { fullname, username, email, phone, password } = req.body;

      let requiredAttr = { fullname: "Fullname", username: "Username", email: "Email", phone: "Phone", password: "Password"} 
      for (const key of Object.keys(requiredAttr)) {
          if (!req.body[key]) {
            return apiBadRequestResponse(`Permintaan tidak lengkap. ${requiredAttr[key]} dari Akun Pelaporr Sertifikat wajib diisi.`);
          }
      }

      const hashed = await hashPassword(password);

      await tUser.create({
        fullname,
        username,
        email,
        phone,
        password: hashed,
      });

      return apiResponse( status.CREATED, "CREATED", "Success create a new account" );
    } catch (err) {
      throw apiResponse(
        err.code || status.INTERNAL_SERVER_ERROR,
        err.status || "INTERNAL_SERVER_ERROR",
        err.message
      );
    }
  },

  login: async (req) => {
    try {
      const { email, password } = req.body;

      let requiredAttr = { email: "Email", password: "Password"} 
      for (const key of Object.keys(requiredAttr)) {
          if (!req.body[key]) {
            return apiBadRequestResponse(`Permintaan tidak lengkap. ${requiredAttr[key]} dari Akun Pelaporr Sertifikat wajib diisi.`);
          }
      }

      const user = await tUser.findOne({ raw: true, where: { email: email, deleted: 0},});
      if (!user) {
        return apiBadRequestResponse("Email does not registered");
      }

      const isPasswordValid = await checkPassword(password, user.password);
      if (!isPasswordValid) {
        return apiBadRequestResponse("Password does not match our records");
      }

      const token = generateToken(user);

      return apiResponse(status.OK, "OK", "Success Login", { ...user, token});
    } catch (err) {
      throw apiResponse(
        err.code || status.INTERNAL_SERVER_ERROR,
        err.status || "INTERNAL_SERVER_ERROR",
        err.message
      );
    }
  },

  me: async (req) => {
    try {
      const { id } = req.user;

      const user = await tUser.findOne({ raw: true, where: { id: id, deleted: 0 } });
      if (!user)
        throw apiBadRequestResponse("User not found");

      return apiResponse(status.OK, "OK", "Success get authenticated user", user);
    } catch (e) {
      throw apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
};
