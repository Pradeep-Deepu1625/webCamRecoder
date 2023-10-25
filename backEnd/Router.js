const express = require("express");
const router =express.Router();
const controller = require("./controller");
router.get("/",controller.getUsers);
router.post("/",controller.createUser);
// router.post("/",controller.Login);
module.exports = router;