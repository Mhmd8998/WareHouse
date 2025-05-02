const router = require("express").Router();
const con = require("../controller/Withdrawl");
const { verifyToken } = require("../middlewares/verifyToken");


router.post("/",verifyToken,con.createWithdrawal);
router.get("/",verifyToken,con.gitWitdraw);

module.exports = router;