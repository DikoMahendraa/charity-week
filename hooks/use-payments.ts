import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { keys } from "@/lib/query/keys";
import type { Payment, PaymentDetail, PaymentFilters } from "@/lib/schemas/payment.schema";

interface ListResponse<T> { data: T[]; total: number; page: number; limit: number; }

export function usePayments(filters?: PaymentFilters) {
  return useQuery({
    queryKey: keys.payments.list(filters),
    queryFn:  () => api.get<ListResponse<Payment>>(ENDPOINTS.payments.list, filters),
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: keys.payments.detail(id),
    queryFn:  () => api.get<PaymentDetail>(ENDPOINTS.payments.detail(id)),
    enabled:  !!id,
  });
}

export function useResendPaymentEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, emailId }: { paymentId: string; emailId: string }) =>
      api.post<void>(`${ENDPOINTS.payments.detail(paymentId)}/emails/${emailId}/resend`),
    onSuccess: (_, { paymentId }) => {
      qc.invalidateQueries({ queryKey: keys.payments.detail(paymentId) });
    },
  });
}
