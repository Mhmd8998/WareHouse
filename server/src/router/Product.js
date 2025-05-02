const router = require("express").Router();
const con = require("../controller/Product");
const { verifyToken } = require("../middlewares/verifyToken");


router.post("/",verifyToken,con.createProduct);
router.get("/",verifyToken,con.allprod);

module.exports = router;