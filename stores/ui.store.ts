import { create } from "zustand";

// ─── Toast ───────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id:      string;
  message: string;
  type:    ToastType;
  duration?: number; // ms, default 4000
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export type ModalKey =
  | "add-institution"
  | "add-challenge"
  | "edit-institution"
  | "edit-profile"
  | "confirm-delete"
  | "confirm-archive";

interface ModalState {
  key:     ModalKey;
  payload?: unknown; // pass the record being edited/deleted
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface UIState {
  // Toasts
  toasts:      Toast[];
  addToast:    (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string)               => void;

  // Modals
  modal:       ModalState | null;
  openModal:   (key: ModalKey, payload?: unknown) => void;
  closeModal:  ()                                  => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar:    ()      => void;
}

let toastId = 0;

export const useUIStore = create<UIState>((set) => ({
  // ── Toasts ──
  toasts: [],
  addToast: (toast) =>
    set((s) => ({
      toasts: [...s.toasts, { ...toast, id: String(++toastId) }],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  // ── Modals ──
  modal:      null,
  openModal:  (key, payload) => set({ modal: { key, payload } }),
  closeModal: ()             => set({ modal: null }),

  // ── Sidebar ──
  sidebarCollapsed: false,
  toggleSidebar:    () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));

// ─── Convenience helpers (call outside React if needed) ───────────────────────

export const toast = {
  success: (message: string, duration?: number) =>
    useUIStore.getState().addToast({ message, type: "success", duration }),
  error: (message: string, duration?: number) =>
    useUIStore.getState().addToast({ message, type: "error", duration }),
  info: (message: string, duration?: number) =>
    useUIStore.getState().addToast({ message, type: "info", duration }),
  warning: (message: string, duration?: number) =>
    useUIStore.getState().addToast({ message, type: "warning", duration }),
};
