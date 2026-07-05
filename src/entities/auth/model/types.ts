// ─── API Response wrapper ────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]> | [];
}

// ─── Profile ─────────────────────────────────────────────────────────────────
export interface StudentProfile {
  userId: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  status: "ACTIVE" | "IN_ACTIVE" | "SUSPENDED";
  totalCategorySubscription: number;
}

// ─── Token ───────────────────────────────────────────────────────────────────
export interface TokenDetails {
  token: string;
  expiresIn: number;
}

// ─── Login response data ─────────────────────────────────────────────────────
export interface LoginResponseData {
  profile?: StudentProfile;
  tokenDetails?: TokenDetails;
  requires_otp?: boolean;
  email?: string;
  otp_purpose?: "account_verification";
  verification_token?: string;
  message?: string;
}

export interface RegisterResponseData {
  requires_otp: boolean;
  email: string;
  otp_purpose: "account_verification";
  verification_token: string;
}

// ─── Register payload ────────────────────────────────────────────────────────
export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

// ─── Login payload ───────────────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

// ─── OTP payload ─────────────────────────────────────────────────────────────
export interface VerifyOtpPayload {
  email: string;
  otp: string;
  verification_token?: string;
}

export interface ResendOtpPayload {
  email: string;
  type: 0;
  verification_token: string;
}

// ─── Reset password payload ──────────────────────────────────────────────────
export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
}

// ─── Update profile payload ───────────────────────────────────────────────────
export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone?: string;
  avatar?: File;
}

// ─── Change password payload ──────────────────────────────────────────────────
export interface ChangePasswordPayload {
  currentPassword: string;
  password: string;
}

// ─── Validation error shape ──────────────────────────────────────────────────
export type ValidationErrors = Record<string, string[]>;
