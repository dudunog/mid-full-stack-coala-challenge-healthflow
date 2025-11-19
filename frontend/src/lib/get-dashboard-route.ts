import type { Role } from "@/app/types/user";

const ROLE_ROUTES: Record<Role, string> = {
  ATTENDANT: "/dashboard/attendant",
  DOCTOR: "/dashboard/doctor",
} as const;

/**
 * Gets the dashboard route for a given role
 * @param role - User role
 * @returns Dashboard route path
 */
export function getDashboardRoute(role: Role): string {
  return ROLE_ROUTES[role];
}
