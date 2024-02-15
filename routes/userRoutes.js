const express = require("express");
const router = express.Router();
const path = require("path");
const { getAllUsers, createNewUser, updateUser, deleteUser } = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/").get(getAllUsers).post(createNewUser).patch(updateUser).delete(deleteUser);

module.exports = router;
