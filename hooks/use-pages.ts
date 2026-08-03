import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { keys } from "@/lib/query/keys";
import type {
  FundraisingPage,
  PageCampaign,
  ReorderCampaignsInput,
} from "@/lib/schemas/page.schema";

interface ListResponse<T> { data: T[]; total: number; page: number; limit: number; }

export function usePages(filters?: object) {
  return useQuery({
    queryKey: keys.pages.list(filters),
    queryFn:  () => api.get<ListResponse<FundraisingPage>>(ENDPOINTS.pages.list, filters),
  });
}

export function usePage(id: string) {
  return useQuery({
    queryKey: keys.pages.detail(id),
    queryFn:  () => api.get<FundraisingPage>(ENDPOINTS.pages.detail(id)),
    enabled:  !!id,
  });
}

export function usePageCampaigns(pageId: string) {
  return useQuery({
    queryKey: keys.pages.campaigns(pageId),
    queryFn:  () => api.get<PageCampaign[]>(`${ENDPOINTS.pages.detail(pageId)}/campaigns`),
    enabled:  !!pageId,
  });
}

export function useReorderCampaigns(pageId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ReorderCampaignsInput) =>
      api.patch<PageCampaign[]>(ENDPOINTS.pages.reorder(pageId), data),
    // Optimistic invalidation — the list will refetch with the new order
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.pages.campaigns(pageId) });
    },
  });
}

export function useToggleCampaign(pageId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ campaignId, enabled }: { campaignId: string; enabled: boolean }) =>
      api.patch<PageCampaign>(
        `${ENDPOINTS.pages.detail(pageId)}/campaigns/${campaignId}`,
        { enabled }
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.pages.campaigns(pageId) });
    },
  });
}
