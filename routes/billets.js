const express = require('express');
const router = express.Router();
const Controller = require('../controllers/billet_ctr');
const security = require('../middlewares/security');

const controller = new Controller();


router.post('/create', security, controller.creation);
router.get('/:id', security, controller.findById);
router.put('/update/:id', security, controller.updateById);
router.put('/annulation/:id', security, controller.annulationBillet);
router.delete('/delete/:id', security, controller.deleteById);

module.exports = router.use('/billet', router);