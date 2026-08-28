const {
  PROPERTY_TYPES,
  TRANSACTION_TYPES,
  LISTING_STATUSES,
  FURNISHING_STATUSES,
  FINISHING_CONDITIONS,
  PAYMENT_TERMS,
  COMMERCIAL_SUBTYPES,
} = require('../config/constants');

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isPositiveNumber(value) {
  return typeof value === 'number' && value > 0;
}

function fail(res, message) {
  return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message } });
}

function validateDetails(propertyType, details) {
  if (!details || typeof details !== 'object') return 'Property details are required.';

  if (propertyType === 'residential') {
    if (!Number.isInteger(details.bedrooms) || details.bedrooms < 0) return 'bedrooms must be a non-negative integer.';
    if (!Number.isInteger(details.bathrooms) || details.bathrooms < 0) return 'bathrooms must be a non-negative integer.';
    if (!FURNISHING_STATUSES.includes(details.furnishingStatus)) return 'Invalid furnishingStatus.';
    if (!FINISHING_CONDITIONS.includes(details.finishingCondition)) return 'Invalid finishingCondition.';
    if (!PAYMENT_TERMS.includes(details.paymentTerms)) return 'Invalid paymentTerms.';
  } else if (propertyType === 'commercial') {
    if (!COMMERCIAL_SUBTYPES.includes(details.commercialSubtype)) return 'Invalid commercialSubtype.';
    if (!PAYMENT_TERMS.includes(details.paymentTerms)) return 'Invalid paymentTerms.';
  } else if (propertyType === 'land') {
    if (!PAYMENT_TERMS.includes(details.paymentTerms)) return 'Invalid paymentTerms.';
  }
  return null;
}

function validateCreateListing(req, res, next) {
  const b = req.body || {};

  if (!PROPERTY_TYPES.includes(b.propertyType)) return fail(res, 'Invalid propertyType.');
  if (!TRANSACTION_TYPES.includes(b.transactionType)) return fail(res, 'Invalid transactionType.');
  if (!isNonEmptyString(b.title)) return fail(res, 'title is required.');
  if (!isNonEmptyString(b.description)) return fail(res, 'description is required.');
  if (b.priceSyp == null && b.priceUsd == null) return fail(res, 'At least one of priceSyp or priceUsd is required.');
  if (b.priceSyp != null && !isPositiveNumber(b.priceSyp)) return fail(res, 'priceSyp must be a positive number.');
  if (b.priceUsd != null && !isPositiveNumber(b.priceUsd)) return fail(res, 'priceUsd must be a positive number.');
  if (!isPositiveNumber(b.areaSqm)) return fail(res, 'areaSqm must be a positive number.');
  if (!Number.isInteger(b.governorateId)) return fail(res, 'governorateId is required.');
  if (!Number.isInteger(b.cityId)) return fail(res, 'cityId is required.');
  if (!isNonEmptyString(b.neighborhood)) return fail(res, 'neighborhood is required.');

  const detailsError = validateDetails(b.propertyType, b.details);
  if (detailsError) return fail(res, detailsError);

  next();
}

function validateUpdateListing(req, res, next) {
  const b = req.body || {};

  if (b.propertyType !== undefined) return fail(res, 'propertyType cannot be changed after creation.');
  if (b.transactionType !== undefined && !TRANSACTION_TYPES.includes(b.transactionType)) return fail(res, 'Invalid transactionType.');
  if (b.status !== undefined && !LISTING_STATUSES.includes(b.status)) return fail(res, 'Invalid status.');
  if (b.title !== undefined && !isNonEmptyString(b.title)) return fail(res, 'title must be a non-empty string.');
  if (b.description !== undefined && !isNonEmptyString(b.description)) return fail(res, 'description must be a non-empty string.');
  if (b.priceSyp === null && b.priceUsd === null) return fail(res, 'At least one price is required.');
  if (b.priceSyp !== undefined && b.priceSyp !== null && !isPositiveNumber(b.priceSyp)) return fail(res, 'priceSyp must be a positive number.');
  if (b.priceUsd !== undefined && b.priceUsd !== null && !isPositiveNumber(b.priceUsd)) return fail(res, 'priceUsd must be a positive number.');
  if (b.areaSqm !== undefined && !isPositiveNumber(b.areaSqm)) return fail(res, 'areaSqm must be a positive number.');

  next();
}

module.exports = { validateCreateListing, validateUpdateListing };
