const reportRepository = require('../repositories/report.repository');
const listingRepository = require('../repositories/listing.repository');
const listingService = require('./listing.service');
const AppError = require('../utils/AppError');
const { toReportResponse } = require('../models/report.model');

async function createReport(reporterId, { reportedListingId, reason, description }) {
  const existing = await listingRepository.findById(reportedListingId);
  if (!existing) {
    throw new AppError('Listing not found.', 404, 'NOT_FOUND');
  }
  if (existing.listing.owner_id === reporterId) {
    throw new AppError('You cannot report your own listing.', 400, 'VALIDATION_ERROR');
  }

  const duplicate = await reportRepository.findPendingByReporterAndListing(reporterId, reportedListingId);
  if (duplicate) {
    throw new AppError('You already reported this listing.', 409, 'DUPLICATE');
  }

  await reportRepository.create({ reporterId, reportedListingId, reason, description });
}

async function listReports(status) {
  const rows = await reportRepository.listByStatus(status);
  return rows.map(toReportResponse);
}

async function dismissReport(reportId, admin, resolutionNote) {
  const report = await reportRepository.findById(reportId);
  if (!report) {
    throw new AppError('Report not found.', 404, 'NOT_FOUND');
  }
  if (report.status !== 'pending') {
    throw new AppError('This report has already been resolved.', 400, 'VALIDATION_ERROR');
  }
  await reportRepository.resolve(reportId, admin.id, 'resolved_dismissed', resolutionNote);
}

async function actionReport(reportId, admin, action, resolutionNote) {
  const report = await reportRepository.findById(reportId);
  if (!report) {
    throw new AppError('Report not found.', 404, 'NOT_FOUND');
  }
  if (report.status !== 'pending') {
    throw new AppError('This report has already been resolved.', 400, 'VALIDATION_ERROR');
  }
  if (!report.reported_listing_id) {
    throw new AppError('This report does not target a listing.', 400, 'VALIDATION_ERROR');
  }

  if (action === 'archive') {
    await listingService.updateListing(report.reported_listing_id, admin, {
      status: 'archived',
      moderationReason: resolutionNote,
    });
    await reportRepository.resolve(reportId, admin.id, 'resolved_actioned', resolutionNote);
  } else if (action === 'remove') {
    // deleteListing clears every report row for this listing (this one included,
    // to satisfy the reports FK) — there's nothing left afterward to mark resolved.
    await listingService.deleteListing(report.reported_listing_id, admin, resolutionNote);
  } else {
    throw new AppError('Invalid action.', 400, 'VALIDATION_ERROR');
  }
}

module.exports = { createReport, listReports, dismissReport, actionReport };
