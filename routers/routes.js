const express = require("express");
const router  = express.Router();
const {body} = require("express-validator");
const routes = require("../controllers/user");
const auth = require("../middleware/auth");

router.get("/", routes.getUserName);

router.get("/signup", routes.signup);

router.post("/signup" , body("password").isLength({min: 8}).withMessage("less than 8 characters") ,routes.authenticateSignup);

router.get("/login", routes.login);

router.post("/login",routes.authenticateLogin);

router.get("/logout", routes.logout);



module.exports = router;