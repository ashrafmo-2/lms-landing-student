import { publicApi, privateApi } from "@/shared/api";
import type {
    ApiResponse,
    LoginPayload,
    LoginResponseData,
    RegisterPayload,
    ResetPasswordPayload,
    StudentProfile,
    VerifyOtpPayload,
} from "../model";

// ─── Register ────────────────────────────────────────────────────────────────
export const register = async (
    payload: RegisterPayload
): Promise<ApiResponse<[]>> => {
    const { data } = await publicApi.post<ApiResponse<[]>>(
        "/auth/register",
        payload
    );
    return data;
};

// ─── Verify Registration OTP ─────────────────────────────────────────────────
export const verifyRegistrationOtp = async (
    payload: VerifyOtpPayload
): Promise<ApiResponse<[]>> => {
    const { data } = await publicApi.post<ApiResponse<[]>>(
        "/auth/verify-otp",
        payload
    );
    return data;
};

// ─── Login ───────────────────────────────────────────────────────────────────
export const login = async (
    payload: LoginPayload
): Promise<ApiResponse<LoginResponseData>> => {
    const { data } = await publicApi.post<ApiResponse<LoginResponseData>>(
        "/auth/login",
        payload
    );
    return data;
};

// ─── Logout ──────────────────────────────────────────────────────────────────
export const logout = async (): Promise<ApiResponse<[]>> => {
    const { data } = await privateApi.post<ApiResponse<[]>>("/auth/logout");
    return data;
};

// ─── Forgot Password — Send OTP ──────────────────────────────────────────────
export const sendForgotPasswordOtp = async (
    email: string
): Promise<ApiResponse<[]>> => {
    const { data } = await publicApi.post<ApiResponse<[]>>(
        "/auth/forgot-password/send-otp",
        { email }
    );
    return data;
};

// ─── Forgot Password — Verify OTP ────────────────────────────────────────────
export const verifyForgotPasswordOtp = async (
    payload: VerifyOtpPayload
): Promise<ApiResponse<[]>> => {
    const { data } = await publicApi.post<ApiResponse<[]>>(
        "/auth/forgot-password/verify-otp",
        payload
    );
    return data;
};

// ─── Forgot Password — Reset ─────────────────────────────────────────────────
export const resetPassword = async (
    payload: ResetPasswordPayload
): Promise<ApiResponse<[]>> => {
    const { data } = await publicApi.post<ApiResponse<[]>>(
        "/auth/forgot-password/reset",
        payload
    );
    return data;
};

// ─── Get Profile ─────────────────────────────────────────────────────────────
export const getProfile = async (): Promise<ApiResponse<StudentProfile>> => {
    const { data } = await privateApi.get<ApiResponse<StudentProfile>>(
        "/profile"
    );
    return data;
};
