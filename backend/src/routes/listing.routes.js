const express = require('express');
const controller = require('../controllers/listing.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
const { uploadListingPhotos } = require('../middlewares/upload.middleware');
const { validateCreateListing, validateUpdateListing } = require('../validators/listing.validator');

const router = express.Router();

// /mine must come before /:id so Express doesn't treat "mine" as an id.
router.get('/mine', requireAuth, controller.listMine);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', requireAuth, validateCreateListing, controller.create);
router.patch('/:id', requireAuth, validateUpdateListing, controller.update);
router.delete('/:id', requireAuth, controller.remove);
router.post('/:id/photos', requireAuth, uploadListingPhotos, controller.uploadPhotos);
router.delete('/:id/photos/:photoId', requireAuth, controller.removePhoto);

module.exports = router;
