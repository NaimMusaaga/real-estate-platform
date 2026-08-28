import apiClient from './apiClient';
import type {
  CreateListingPayload,
  Listing,
  ListingPhoto,
  ListingSearchParams,
  ListingSearchResponse,
  UpdateListingPayload,
} from '../../types/listing.types';

export async function createListing(payload: CreateListingPayload): Promise<Listing> {
  const { data } = await apiClient.post<Listing>('/listings', payload);
  return data;
}

export async function getListing(id: string): Promise<Listing> {
  const { data } = await apiClient.get<Listing>(`/listings/${id}`);
  return data;
}

export async function listListings(params: ListingSearchParams): Promise<ListingSearchResponse> {
  const { data } = await apiClient.get<ListingSearchResponse>('/listings', { params });
  return data;
}

export async function listMyListings(): Promise<Listing[]> {
  const { data } = await apiClient.get<Listing[]>('/listings/mine');
  return data;
}

export async function updateListing(id: string, payload: UpdateListingPayload): Promise<Listing> {
  const { data } = await apiClient.patch<Listing>(`/listings/${id}`, payload);
  return data;
}

export async function deleteListing(id: string): Promise<void> {
  await apiClient.delete(`/listings/${id}`);
}

export async function uploadListingPhotos(id: string, files: File[]): Promise<ListingPhoto[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('photos', file));
  const { data } = await apiClient.post<ListingPhoto[]>(`/listings/${id}/photos`, formData);
  return data;
}

export async function deleteListingPhoto(id: string, photoId: string): Promise<void> {
  await apiClient.delete(`/listings/${id}/photos/${photoId}`);
}
