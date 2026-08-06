import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { keys } from "@/lib/query/keys";
import type { Donor, DonorDetail, DonorFilters } from "@/lib/schemas/donor.schema";

interface ListResponse<T> { data: T[]; total: number; page: number; limit: number; }

export function useDonors(filters?: DonorFilters) {
  return useQuery({
    queryKey: keys.donors.list(filters),
    queryFn:  () => api.get<ListResponse<Donor>>(ENDPOINTS.donors.list, filters),
  });
}

export function useDonor(id: string) {
  return useQuery({
    queryKey: keys.donors.detail(id),
    queryFn:  () => api.get<DonorDetail>(ENDPOINTS.donors.detail(id)),
    enabled:  !!id,
  });
}
