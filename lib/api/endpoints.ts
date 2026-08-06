// Central registry of every API endpoint.
// Swap in real paths here once the backend is deployed  nothing else changes.

export const ENDPOINTS = {
  // Auth
  auth: {
    login:  "/auth/login",
    logout: "/auth/logout",
    me:     "/auth/me",
    refresh: "/auth/refresh",
  },

  // Campaign
  institutions: {
    list:   "/institutions",
    detail: (id: string) => `/institutions/${id}`,
    create: "/institutions",
    update: (id: string) => `/institutions/${id}`,
    delete: (id: string) => `/institutions/${id}`,
  },

  challenges: {
    list:   "/challenges",
    detail: (id: string) => `/challenges/${id}`,
    create: "/challenges",
    update: (id: string) => `/challenges/${id}`,
    delete: (id: string) => `/challenges/${id}`,
  },

  pages: {
    list:    "/fundraising-pages",
    detail:  (id: string) => `/fundraising-pages/${id}`,
    create:  "/fundraising-pages",
    update:  (id: string) => `/fundraising-pages/${id}`,
    reorder: (id: string) => `/fundraising-pages/${id}/campaigns/reorder`,
    archive: (pageId: string, campaignId: string) =>
      `/fundraising-pages/${pageId}/campaigns/${campaignId}/archive`,
  },

  // Report
  donors: {
    list:   "/donors",
    detail: (id: string) => `/donors/${id}`,
    export: "/donors/export",
  },

  payments: {
    list:   "/payments",
    detail: (id: string) => `/payments/${id}`,
    export: "/payments/export",
  },

  // Site
  cms: {
    list:   "/cms",
    detail: (id: string) => `/cms/${id}`,
    update: (id: string) => `/cms/${id}`,
  },

  // Admin
  users: {
    list:   "/users",
    detail: (id: string) => `/users/${id}`,
    create: "/users",
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
} as const;
