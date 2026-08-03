// Centralised query key factory.
// Using factory functions avoids typos and makes cache invalidation
// precise — e.g. invalidate all donor queries with queryClient.invalidateQueries(keys.donors.all())

export const keys = {
  institutions: {
    all:    ()           => ["institutions"]              as const,
    list:   (filters?: object) => ["institutions", "list", filters] as const,
    detail: (id: string) => ["institutions", "detail", id] as const,
  },

  challenges: {
    all:    ()           => ["challenges"]               as const,
    list:   (filters?: object) => ["challenges", "list", filters] as const,
    detail: (id: string) => ["challenges", "detail", id] as const,
  },

  pages: {
    all:    ()           => ["pages"]                    as const,
    list:   (filters?: object) => ["pages", "list", filters] as const,
    detail: (id: string) => ["pages", "detail", id]     as const,
    campaigns: (id: string) => ["pages", id, "campaigns"] as const,
  },

  donors: {
    all:    ()           => ["donors"]                   as const,
    list:   (filters?: object) => ["donors", "list", filters] as const,
    detail: (id: string) => ["donors", "detail", id]    as const,
  },

  payments: {
    all:    ()           => ["payments"]                 as const,
    list:   (filters?: object) => ["payments", "list", filters] as const,
    detail: (id: string) => ["payments", "detail", id]  as const,
  },

  users: {
    all:    ()           => ["users"]                    as const,
    list:   (filters?: object) => ["users", "list", filters] as const,
    detail: (id: string) => ["users", "detail", id]     as const,
  },
} as const;
