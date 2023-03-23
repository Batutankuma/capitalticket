const express = require('express');
const router = express.Router();
const Controller = require('../controllers/trajet_ctr');
const security = require('../middlewares/security');

const controller = new Controller();

router.post('/create', security, controller.create);
router.get('/read/:id', security, controller.findById);
router.get('/list/disp', security, controller.listDispoTrajet);
router.put('/update/:id', security, controller.updateById);
router.delete('/delete/:id', security, controller.deleteById);


module.exports = router.use('/trajet',router);