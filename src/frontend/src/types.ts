import { Role } from "./backend";

export { Role };

export type UserRole = Role;

export interface CurrentUser {
  employeeId: bigint;
  name: string;
  role: UserRole;
  department: string;
  designation: string;
  sessionToken: string;
  mustChangePassword: boolean;
}

export interface ApiResponse<T> {
  ok?: T;
  err?: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  SystemAdmin: "System Admin",
  Employee: "Employee",
  SafetyOfficer: "Safety Officer",
  HOD: "Head of Department",
  AreaInCharge: "Area In Charge",
  ContractorAdmin: "Contractor Admin",
};

export const ROLE_LANDING: Record<UserRole, string> = {
  SystemAdmin: "/users",
  Employee: "/dashboard",
  SafetyOfficer: "/dashboard",
  HOD: "/dashboard",
  AreaInCharge: "/dashboard",
  ContractorAdmin: "/dashboard",
};

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter.";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number.";
  if (!/[^A-Za-z0-9]/.test(password))
    return "Password must contain at least one special character.";
  return null;
}
