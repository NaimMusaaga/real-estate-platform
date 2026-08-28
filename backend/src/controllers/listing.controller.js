const listingService = require('../services/listing.service');

async function create(req, res, next) {
  try {
    const listing = await listingService.createListing(req.user.id, req.body);
    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const listing = await listingService.getListingById(req.params.id);
    res.json(listing);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const { governorateId, cityId, propertyType, transactionType, q, page, limit } = req.query;
    const result = await listingService.listListings(
      {
        governorateId: governorateId ? Number(governorateId) : undefined,
        cityId: cityId ? Number(cityId) : undefined,
        propertyType,
        transactionType,
        q,
      },
      { page: Number(page) || 1, limit: Math.min(Number(limit) || 20, 50) },
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function listMine(req, res, next) {
  try {
    const listings = await listingService.listMyListings(req.user.id);
    res.json(listings);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const listing = await listingService.updateListing(req.params.id, req.user, req.body);
    res.json(listing);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await listingService.deleteListing(req.params.id, req.user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function uploadPhotos(req, res, next) {
  try {
    const photos = await listingService.addPhotos(req.params.id, req.user, req.files);
    res.status(201).json(photos);
  } catch (err) {
    next(err);
  }
}

async function removePhoto(req, res, next) {
  try {
    await listingService.removePhoto(req.params.id, req.params.photoId, req.user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getById, list, listMine, update, remove, uploadPhotos, removePhoto };
