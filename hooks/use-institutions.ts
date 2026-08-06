import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { keys } from "@/lib/query/keys";
import type {
  Institution,
  InstitutionListResponse,
  CreateInstitutionInput,
  UpdateInstitutionInput,
} from "@/lib/schemas/institution.schema";

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useInstitutions(filters?: object) {
  return useQuery({
    queryKey: keys.institutions.list(filters),
    queryFn:  () => api.get<InstitutionListResponse>(ENDPOINTS.institutions.list, filters),
  });
}

export function useInstitution(id: string) {
  return useQuery({
    queryKey: keys.institutions.detail(id),
    queryFn:  () => api.get<Institution>(ENDPOINTS.institutions.detail(id)),
    enabled:  !!id,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useCreateInstitution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInstitutionInput) =>
      api.post<Institution>(ENDPOINTS.institutions.create, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.institutions.all() });
    },
  });
}

export function useUpdateInstitution(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateInstitutionInput) =>
      api.patch<Institution>(ENDPOINTS.institutions.update(id), data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.institutions.all() });
    },
  });
}

export function useDeleteInstitution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<void>(ENDPOINTS.institutions.delete(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.institutions.all() });
    },
  });
}
