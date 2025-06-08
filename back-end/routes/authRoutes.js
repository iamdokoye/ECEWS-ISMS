const exppress = require('express');
const { loginUser } = require('../controllers/authController.js');
const router = exppress.Router()
;
router.post('/login', loginUser);

module.exports = router;