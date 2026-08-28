import type { CreateListingPayload, PropertyType, TransactionType } from '../../../types/listing.types';

export interface ListingDraft {
  propertyType: PropertyType | null;
  transactionType: TransactionType | null;
  governorateId: number | null;
  cityId: number | null;
  neighborhood: string;
  addressDetail: string;
  areaSqm: string;
  title: string;
  description: string;
  priceSyp: string;
  priceUsd: string;
  residential: {
    bedrooms: string;
    bathrooms: string;
    floorNumber: string;
    totalFloors: string;
    furnishingStatus: 'furnished' | 'unfurnished' | 'semi_furnished';
    buildingYear: string;
    finishingCondition: 'unfinished' | 'semi_finished' | 'fully_finished';
    paymentTerms: 'cash' | 'installments' | 'both';
  };
  commercial: {
    commercialSubtype: 'shop' | 'office' | 'warehouse' | 'other';
    floorNumber: string;
    frontageNotes: string;
    paymentTerms: 'cash' | 'installments' | 'both';
  };
  land: {
    zoningNotes: string;
    utilitiesConnected: boolean;
    paymentTerms: 'cash' | 'installments' | 'both';
  };
}

export const INITIAL_DRAFT: ListingDraft = {
  propertyType: null,
  transactionType: null,
  governorateId: null,
  cityId: null,
  neighborhood: '',
  addressDetail: '',
  areaSqm: '',
  title: '',
  description: '',
  priceSyp: '',
  priceUsd: '',
  residential: {
    bedrooms: '',
    bathrooms: '',
    floorNumber: '',
    totalFloors: '',
    furnishingStatus: 'unfurnished',
    buildingYear: '',
    finishingCondition: 'fully_finished',
    paymentTerms: 'cash',
  },
  commercial: {
    commercialSubtype: 'shop',
    floorNumber: '',
    frontageNotes: '',
    paymentTerms: 'cash',
  },
  land: {
    zoningNotes: '',
    utilitiesConnected: false,
    paymentTerms: 'cash',
  },
};

export function buildPayload(draft: ListingDraft): CreateListingPayload {
  const common = {
    transactionType: draft.transactionType as TransactionType,
    title: draft.title.trim(),
    description: draft.description.trim(),
    priceSyp: draft.priceSyp ? Number(draft.priceSyp) : null,
    priceUsd: draft.priceUsd ? Number(draft.priceUsd) : null,
    areaSqm: Number(draft.areaSqm),
    governorateId: draft.governorateId as number,
    cityId: draft.cityId as number,
    neighborhood: draft.neighborhood.trim(),
    addressDetail: draft.addressDetail.trim() || null,
  };

  if (draft.propertyType === 'commercial') {
    return {
      ...common,
      propertyType: 'commercial',
      details: {
        commercialSubtype: draft.commercial.commercialSubtype,
        floorNumber: draft.commercial.floorNumber ? Number(draft.commercial.floorNumber) : null,
        frontageNotes: draft.commercial.frontageNotes.trim() || null,
        paymentTerms: draft.commercial.paymentTerms,
      },
    };
  }

  if (draft.propertyType === 'land') {
    return {
      ...common,
      propertyType: 'land',
      details: {
        zoningNotes: draft.land.zoningNotes.trim() || null,
        utilitiesConnected: draft.land.utilitiesConnected,
        paymentTerms: draft.land.paymentTerms,
      },
    };
  }

  return {
    ...common,
    propertyType: 'residential',
    details: {
      bedrooms: Number(draft.residential.bedrooms),
      bathrooms: Number(draft.residential.bathrooms),
      floorNumber: draft.residential.floorNumber ? Number(draft.residential.floorNumber) : null,
      totalFloors: draft.residential.totalFloors ? Number(draft.residential.totalFloors) : null,
      furnishingStatus: draft.residential.furnishingStatus,
      buildingYear: draft.residential.buildingYear ? Number(draft.residential.buildingYear) : null,
      finishingCondition: draft.residential.finishingCondition,
      paymentTerms: draft.residential.paymentTerms,
    },
  };
}
