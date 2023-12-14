const express = require("express");
const authC = require("../controllers/auth.controller");
const { authentication, } = require("../middlewares/authentication.middleware");
const { loginLimit } = require("../middlewares/limiter.middleware");

const router = express.Router();
router.post("/register",  authC.register);
router.post("/login", loginLimit, authC.login);
router.get("/me", authentication, authC.me);

module.exports = router;
