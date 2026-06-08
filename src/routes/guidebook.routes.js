const express = require('express');
const router = express.Router();
const GuidebookController = require('../controllers/guidebook.controller');

router.get('/', GuidebookController.index);
router.get('/:id', GuidebookController.show);
router.post('/', GuidebookController.store);
router.put('/:id', GuidebookController.update);
router.delete('/:id', GuidebookController.destroy);

module.exports = router;