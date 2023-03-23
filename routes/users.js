const express = require('express');
const router = express.Router();
const Controller = require('./../controllers/user_ctr');
const security = require('./../middlewares/security');

const controller = new Controller();

router.post('/login', controller.signIn);
router.post('/signup', controller.signUp);
router.get('/:id', security, controller.findById);
router.put('/update/:id', security, controller.updateById);
router.delete('/delete/:id', security, controller.deleteById);

module.exports = router.use('/users',router);