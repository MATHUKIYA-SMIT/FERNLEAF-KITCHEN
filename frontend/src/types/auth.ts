export type UserRole =
  | "Admin"
  | "Kitchen"
  | "Dispatch"
  | "Driver";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: UserRole;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_available: boolean;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
}