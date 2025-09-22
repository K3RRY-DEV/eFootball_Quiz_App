
export const pageAccess: Record<string, { publicOnly?: boolean; requiredRole?: string }> = {
  '/login': { publicOnly: true },
  '/signup': { publicOnly: true },
  '/dashboard': {}, // any authenticated user
  '/admin/dashboard': { requiredRole: "admin" }, // only admin
};
