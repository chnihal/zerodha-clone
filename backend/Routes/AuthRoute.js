const { Signup, Login, Me, Deposit } = require("../Controllers/AuthController"); 
const { userVerification } = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/verify", userVerification);
router.get("/me", Me);
router.post("/deposit", Deposit);

module.exports = router;
