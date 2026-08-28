const referenceDataRepository = require('../repositories/referenceData.repository');

async function getGovernorates(req, res, next) {
  try {
    const rows = await referenceDataRepository.findAllGovernorates();
    res.json(rows.map((r) => ({ id: r.id, nameAr: r.name_ar })));
  } catch (err) {
    next(err);
  }
}

async function getCities(req, res, next) {
  try {
    const rows = await referenceDataRepository.findCitiesByGovernorate(Number(req.params.governorateId));
    res.json(rows.map((r) => ({ id: r.id, governorateId: r.governorate_id, nameAr: r.name_ar })));
  } catch (err) {
    next(err);
  }
}

module.exports = { getGovernorates, getCities };
