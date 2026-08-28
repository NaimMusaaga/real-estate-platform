const fs = require('fs/promises');
const path = require('path');
const listingRepository = require('../repositories/listing.repository');
const listingPhotoRepository = require('../repositories/listingPhoto.repository');
const referenceDataRepository = require('../repositories/referenceData.repository');
const adminAuditLogRepository = require('../repositories/adminAuditLog.repository');
const reportRepository = require('../repositories/report.repository');
const AppError = require('../utils/AppError');
const env = require('../config/env');
const { toListingResponse } = require('../models/listing.model');
const { toListingPhotoResponse } = require('../models/listingPhoto.model');

async function validateLocation(governorateId, cityId) {
  const city = await referenceDataRepository.findCityById(cityId);
  if (!city || city.governorate_id !== governorateId) {
    throw new AppError('The selected city does not belong to the selected governorate.', 400, 'VALIDATION_ERROR');
  }
}

function assertCanModify(listing, currentUser) {
  if (currentUser.role === 'admin') return;
  if (listing.owner_id !== currentUser.id) {
    throw new AppError('You do not have permission to modify this listing.', 403, 'FORBIDDEN');
  }
}

function photoFilePath(url) {
  return path.join(__dirname, '..', '..', env.upload.dir, path.basename(url));
}

async function createListing(ownerId, input) {
  await validateLocation(input.governorateId, input.cityId);
  const listingId = await listingRepository.create(ownerId, input);
  return getListingById(listingId);
}

async function getListingById(id) {
  const result = await listingRepository.findById(id);
  if (!result) {
    throw new AppError('Listing not found.', 404, 'NOT_FOUND');
  }
  const photoRows = await listingPhotoRepository.findByListingId(id);
  return toListingResponse(result.listing, result.details, photoRows.map(toListingPhotoResponse));
}

async function listListings(filters, pagination) {
  const { rows, totalCount } = await listingRepository.list(filters, pagination);
  const items = await Promise.all(
    rows.map(async (r) => {
      const photoRows = await listingPhotoRepository.findByListingId(r.listing.id);
      return toListingResponse(r.listing, r.details, photoRows.map(toListingPhotoResponse));
    }),
  );
  return {
    items,
    page: pagination.page,
    limit: pagination.limit,
    totalCount,
  };
}

async function listMyListings(ownerId) {
  const rows = await listingRepository.listByOwner(ownerId);
  return Promise.all(
    rows.map(async (r) => {
      const photoRows = await listingPhotoRepository.findByListingId(r.listing.id);
      return toListingResponse(r.listing, r.details, photoRows.map(toListingPhotoResponse));
    }),
  );
}

// True only when an admin is acting on someone ELSE's listing — a moderation
// action, distinct from a normal self-service edit, and the thing the audit
// log needs to capture.
function isModerationAction(listing, currentUser) {
  return currentUser.role === 'admin' && listing.owner_id !== currentUser.id;
}

async function updateListing(id, currentUser, input) {
  const existing = await listingRepository.findById(id);
  if (!existing) {
    throw new AppError('Listing not found.', 404, 'NOT_FOUND');
  }
  assertCanModify(existing.listing, currentUser);

  if (input.governorateId && input.cityId) {
    await validateLocation(input.governorateId, input.cityId);
  }

  await listingRepository.update(id, existing.listing.property_type, input);

  if (input.status === 'archived' && isModerationAction(existing.listing, currentUser)) {
    await adminAuditLogRepository.create(currentUser.id, 'archive_listing', 'listings', id, input.moderationReason ?? null);
  }

  return getListingById(id);
}

async function deleteListing(id, currentUser, moderationReason) {
  const existing = await listingRepository.findById(id);
  if (!existing) {
    throw new AppError('Listing not found.', 404, 'NOT_FOUND');
  }
  assertCanModify(existing.listing, currentUser);
  const shouldAudit = isModerationAction(existing.listing, currentUser);

  const photoRows = await listingPhotoRepository.findByListingId(id);
  // reports.reported_listing_id has no ON DELETE CASCADE (and can't — a CHECK
  // constraint requires it to always point at something), so any report ever
  // filed against this listing must be cleared first or the delete below hits
  // a FK violation.
  await reportRepository.deleteByListingId(id);
  await listingRepository.remove(id); // cascades listing_photos rows via FK
  await Promise.all(photoRows.map((photo) => fs.unlink(photoFilePath(photo.url)).catch(() => {})));

  if (shouldAudit) {
    // Unlike archive_listing, the listing row is gone by the time anyone reads this
    // entry back — the audit-log join can't recover its title, so bake it into the
    // reason text now while we still have it.
    const note = moderationReason ? `${existing.listing.title}: ${moderationReason}` : existing.listing.title;
    await adminAuditLogRepository.create(currentUser.id, 'remove_listing', 'listings', id, note);
  }
}

// Multer already wrote `files` to disk by the time this runs (it's middleware,
// upstream of every check below) — so every rejection path here must clean them
// up too, not just the "too many photos" one, or a bad request (wrong owner,
// unknown listing) leaks a file on disk forever.
async function addPhotos(listingId, currentUser, files) {
  let filesToCleanup = files;
  try {
    const existing = await listingRepository.findById(listingId);
    if (!existing) {
      throw new AppError('Listing not found.', 404, 'NOT_FOUND');
    }
    assertCanModify(existing.listing, currentUser);

    if (!files || files.length === 0) {
      throw new AppError('No photos provided.', 400, 'VALIDATION_ERROR');
    }

    const currentCount = await listingPhotoRepository.countByListingId(listingId);
    if (currentCount + files.length > env.upload.maxPhotosPerListing) {
      throw new AppError(`A listing can have at most ${env.upload.maxPhotosPerListing} photos.`, 400, 'VALIDATION_ERROR');
    }

    const urls = files.map((file) => `/${env.upload.dir}/${file.filename}`);
    await listingPhotoRepository.insertMany(listingId, urls, currentCount);
    filesToCleanup = null; // committed to the DB — no longer orphans if a later step fails

    const photoRows = await listingPhotoRepository.findByListingId(listingId);
    return photoRows.map(toListingPhotoResponse);
  } catch (err) {
    if (filesToCleanup) {
      await Promise.all(filesToCleanup.map((file) => fs.unlink(file.path).catch(() => {})));
    }
    throw err;
  }
}

async function removePhoto(listingId, photoId, currentUser) {
  const existing = await listingRepository.findById(listingId);
  if (!existing) {
    throw new AppError('Listing not found.', 404, 'NOT_FOUND');
  }
  assertCanModify(existing.listing, currentUser);

  const photo = await listingPhotoRepository.findById(photoId);
  if (!photo || photo.listing_id !== listingId) {
    throw new AppError('Photo not found.', 404, 'NOT_FOUND');
  }

  await listingPhotoRepository.remove(photoId);
  await fs.unlink(photoFilePath(photo.url)).catch(() => {});
}

module.exports = {
  createListing,
  getListingById,
  listListings,
  listMyListings,
  updateListing,
  deleteListing,
  addPhotos,
  removePhoto,
};
