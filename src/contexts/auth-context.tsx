"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import {
    login as apiLogin,
    logout as apiLogout,
    register as apiRegister,
    verifyRegistrationOtp as apiVerifyOtp,
    getProfile,
} from "@/entities/auth/api";
import type { StudentProfile, RegisterPayload } from "@/entities/auth/model";

// ─── Types ───────────────────────────────────────────────────────────────────
interface AuthContextType {
    user: StudentProfile | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Auth actions
    login: (email: string, password: string) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    verifyOtp: (email: string, otp: string) => Promise<void>;
    logout: () => Promise<void>;

    // Helpers
    refreshProfile: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Storage helpers ─────────────────────────────────────────────────────────
const STORAGE_KEYS = {
    TOKEN: "token",
    USER: "user",
} as const;

function saveSession(token: string, user: StudentProfile) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<StudentProfile | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Rehydrate from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch {
                clearSession();
            }
        }
        setIsLoading(false);
    }, []);

    // ── Login ──────────────────────────────────────────────────────────────────
    const login = useCallback(async (email: string, password: string) => {
        const res = await apiLogin({ email, password });
        const { profile, tokenDetails } = res.data;
        saveSession(tokenDetails.token, profile);
        setToken(tokenDetails.token);
        setUser(profile);
    }, []);

    // ── Register (step 1 — sends OTP) ─────────────────────────────────────────
    const register = useCallback(async (payload: RegisterPayload) => {
        await apiRegister(payload);
        // OTP is sent — caller should redirect to OTP verification step
    }, []);

    // ── Verify OTP (step 2 — confirms registration) ───────────────────────────
    const verifyOtp = useCallback(async (email: string, otp: string) => {
        await apiVerifyOtp({ email, otp });
        // Account verified — caller should redirect to login
    }, []);

    // ── Logout ─────────────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        try {
            await apiLogout();
        } catch {
            // Even if the API call fails, clear local session
        } finally {
            clearSession();
            setToken(null);
            setUser(null);
        }
    }, []);

    // ── Refresh profile ────────────────────────────────────────────────────────
    const refreshProfile = useCallback(async () => {
        const res = await getProfile();
        setUser(res.data);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data));
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token && !!user,
                isLoading,
                login,
                register,
                verifyOtp,
                logout,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
