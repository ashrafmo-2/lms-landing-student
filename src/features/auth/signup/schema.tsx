import { z } from "zod";

export function createSignupSchema(t: (key: string) => string) {
    return z
        .object({
            name: z.string().min(3, t("errors.nameMin")),
            email: z.string().email(t("errors.emailInvalid")),
            phone: z
                .string()
                .regex(/^01[0-9]{9}$/, t("errors.phoneInvalid"))
                .optional()
                .or(z.literal("")),
            password: z
                .string()
                .min(8, t("errors.passwordMin"))
                .regex(/[A-Za-z]/, t("errors.passwordLetter"))
                .regex(/[0-9]/, t("errors.passwordNumber")),
            confirmPassword: z.string(),
        })
        .refine((d) => d.password === d.confirmPassword, {
            message: t("errors.passwordsMismatch"),
            path: ["confirmPassword"],
        });
}

export type SignupFormValues = z.infer<ReturnType<typeof createSignupSchema>>;
