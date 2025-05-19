const route = reqire("express").Router()
const {verifyToken,verifyTokenAndAdmin} = require("../middlewares/verifyToken");
const {getAdminNotification} = require("../controller/Admin");

router.get("/notification",verifyToken,verifyTokenAndAdmin,getAdminNotification)

module.exports = roter;
