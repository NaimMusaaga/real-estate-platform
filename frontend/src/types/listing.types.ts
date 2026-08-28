export type PropertyType = 'residential' | 'commercial' | 'land';
export type TransactionType = 'sale' | 'rent';
export type ListingStatus = 'active' | 'sold_rented' | 'archived';

export type FurnishingStatus = 'furnished' | 'unfurnished' | 'semi_furnished';
export type FinishingCondition = 'unfinished' | 'semi_finished' | 'fully_finished';
export type PaymentTerms = 'cash' | 'installments' | 'both';
export type CommercialSubtype = 'shop' | 'office' | 'warehouse' | 'other';

export interface ResidentialDetails {
  bedrooms: number;
  bathrooms: number;
  floorNumber: number | null;
  totalFloors: number | null;
  furnishingStatus: FurnishingStatus;
  buildingYear: number | null;
  finishingCondition: FinishingCondition;
  paymentTerms: PaymentTerms;
}

export interface CommercialDetails {
  commercialSubtype: CommercialSubtype;
  floorNumber: number | null;
  frontageNotes: string | null;
  paymentTerms: PaymentTerms;
}

export interface LandDetails {
  zoningNotes: string | null;
  utilitiesConnected: boolean;
  paymentTerms: PaymentTerms;
}

export interface ListingPhoto {
  id: string;
  url: string;
  sortOrder: number;
  createdAt: string;
}

export interface Listing {
  id: string;
  ownerId: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  title: string;
  description: string;
  priceSyp: number | null;
  priceUsd: number | null;
  areaSqm: number;
  governorateId: number;
  cityId: number;
  neighborhood: string;
  addressDetail: string | null;
  status: ListingStatus;
  photos: ListingPhoto[];
  createdAt: string;
  updatedAt: string;
  residentialDetails?: ResidentialDetails;
  commercialDetails?: CommercialDetails;
  landDetails?: LandDetails;
}

export interface ListingSearchParams {
  governorateId?: number;
  cityId?: number;
  propertyType?: PropertyType;
  transactionType?: TransactionType;
  q?: string;
  page?: number;
  limit?: number;
}

export interface ListingSearchResponse {
  items: Listing[];
  page: number;
  limit: number;
  totalCount: number;
}

export interface Governorate {
  id: number;
  nameAr: string;
}

export interface City {
  id: number;
  governorateId: number;
  nameAr: string;
}

interface CommonListingFields {
  transactionType: TransactionType;
  title: string;
  description: string;
  priceSyp: number | null;
  priceUsd: number | null;
  areaSqm: number;
  governorateId: number;
  cityId: number;
  neighborhood: string;
  addressDetail: string | null;
}

// A real discriminated union, not a loose bag — now that Screen 5 is the actual
// consumer building this shape, `details` can be pinned to exactly the right type
// per propertyType instead of `Record<string, unknown>`.
export type CreateListingPayload =
  | (CommonListingFields & { propertyType: 'residential'; details: ResidentialDetails })
  | (CommonListingFields & { propertyType: 'commercial'; details: CommercialDetails })
  | (CommonListingFields & { propertyType: 'land'; details: LandDetails });

// Update stays loose and partial — propertyType can't change post-creation (matches
// the backend validator), and most updates (e.g. a status toggle) touch one field.
export type UpdateListingPayload = Partial<Omit<CommonListingFields, never>> & {
  status?: ListingStatus;
  details?: Partial<ResidentialDetails> | Partial<CommercialDetails> | Partial<LandDetails>;
};
