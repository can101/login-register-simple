const express = require('express');
const userCotroller = require('../controllers/userController')
const router = express.Router();

router.get('/login', userCotroller.getUserLogin);

router.get('/register', userCotroller.getUserRegister);

router.post('/login', userCotroller.postUserLogin);

router.post('/register', userCotroller.postUserRegister);

module.exports = router;