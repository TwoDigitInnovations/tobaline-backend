'use strict';

const express = require('express');
const router = express.Router();
const clothTypeController = require('@controllers/clothTypeController');


router.post('/create', clothTypeController.createClothType);
router.get('/list', clothTypeController.getClothTypes);
router.post('/update', clothTypeController.updateClothType);
router.delete('/delete', clothTypeController.deleteClothType);

module.exports = router;
