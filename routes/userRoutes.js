const express = require('express');
const { getAllUsers, registerControllers, loginControllers } = require('../controllers/usercontroller');

//router object
const router = express.Router();

//GET ALL USERS || GET
router.get("/all-users", getAllUsers);

router.post("/login",loginControllers);

//New user post
router.post("/register", registerControllers);

//Login pots


module.exports = router;


