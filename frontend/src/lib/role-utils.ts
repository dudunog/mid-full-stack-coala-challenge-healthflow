import type { Role } from "@/app/types/user";

const VALID_ROLES: readonly Role[] = ["ATTENDANT", "DOCTOR"] as const;

/**
 * Checks if a given string is a valid role
 * @param role - String to check
 * @returns true if the role is valid, false otherwise
 */
export function isValidRole(role: Role): boolean {
  return VALID_ROLES.includes(role);
}

/**
 * Gets all valid roles
 * @returns Array of valid roles
 */
export function getValidRoles(): readonly Role[] {
  return VALID_ROLES;
}
