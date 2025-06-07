const exppress = reuqire('exppress');
const { loginUser } = require('../controllers/authController');
const router = exppress.Router();
router.post('/', loginUser);

module.exports = router;