export type Role = "ATTENDANT" | "DOCTOR";

export type User = {
  id: string;
  email: string;
  role: Role;
};
