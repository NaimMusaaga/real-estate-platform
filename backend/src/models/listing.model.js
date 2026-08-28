function toListingResponse(row, details, photos = []) {
  const base = {
    id: row.id,
    ownerId: row.owner_id,
    propertyType: row.property_type,
    transactionType: row.transaction_type,
    title: row.title,
    description: row.description,
    priceSyp: row.price_syp !== null ? Number(row.price_syp) : null,
    priceUsd: row.price_usd !== null ? Number(row.price_usd) : null,
    areaSqm: Number(row.area_sqm),
    governorateId: row.governorate_id,
    cityId: row.city_id,
    neighborhood: row.neighborhood,
    addressDetail: row.address_detail,
    status: row.status,
    photos,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  if (row.property_type === 'residential' && details) {
    base.residentialDetails = {
      bedrooms: details.bedrooms,
      bathrooms: details.bathrooms,
      floorNumber: details.floor_number,
      totalFloors: details.total_floors,
      furnishingStatus: details.furnishing_status,
      buildingYear: details.building_year,
      finishingCondition: details.finishing_condition,
      paymentTerms: details.payment_terms,
    };
  } else if (row.property_type === 'commercial' && details) {
    base.commercialDetails = {
      commercialSubtype: details.commercial_subtype,
      floorNumber: details.floor_number,
      frontageNotes: details.frontage_notes,
      paymentTerms: details.payment_terms,
    };
  } else if (row.property_type === 'land' && details) {
    base.landDetails = {
      zoningNotes: details.zoning_notes,
      utilitiesConnected: !!details.utilities_connected,
      paymentTerms: details.payment_terms,
    };
  }

  return base;
}

module.exports = { toListingResponse };
