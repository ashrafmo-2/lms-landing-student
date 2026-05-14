import { useAuth } from "@/contexts/auth-context";
import { updateProfile } from "@/entities/auth";
import { Camera, Check, Loader2, Mail, Phone, Save, User } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslations } from "use-intl";

export function ProfileTab() {
    const inputCls = "w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm";

    const t = useTranslations("Dashboard.settings");
    const { user, refreshProfile } = useAuth();

    const [form, setForm] = useState({
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
    });

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((p) => ({ ...p, [e.target.id]: e.target.value }));
    }

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            await updateProfile({
                name: form.name,
                email: form.email,
                phone: form.phone || undefined,
                avatar: avatarFile || undefined,
            });
            await refreshProfile();
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch {
            setError(t("saveError") ?? "حدث خطأ أثناء الحفظ، حاول مرة أخرى.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSave} className="space-y-8">
            {/* Avatar */}
            <div className="flex items-center gap-6">
                <div className="relative">
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="avatar" className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
                    ) : (
                        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {user?.name?.[0] ?? "؟"}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="absolute -bottom-2 -left-2 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary-dark transition-colors"
                    >
                        <Camera className="w-3.5 h-3.5" />
                    </button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml,image/webp"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />
                </div>
                <div>
                    <p className="font-bold text-foreground">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${user?.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                        }`}>
                        {user?.status === "ACTIVE" ? t("active") : t("inactive")}
                    </span>
                </div>
            </div>

            {/* Fields */}
            <div className="grid sm:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-bold text-foreground mb-2">
                        <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {t("fullName")}</span>
                    </label>
                    <input id="name" type="text" value={form.name} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-foreground mb-2">
                        <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {t("phoneNumber")}</span>
                    </label>
                    <input id="phone" type="tel" value={form.phone ?? ""} onChange={handleChange} className={inputCls} dir="ltr" />
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-bold text-foreground mb-2">
                        <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {t("email")}</span>
                    </label>
                    <input id="email" type="email" value={form.email} onChange={handleChange} className={inputCls} dir="ltr" />
                </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md"
            >
                {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {t("saving")}</>
                ) : saved ? (
                    <><Check className="w-4 h-4" /> {t("saved")}</>
                ) : (
                    <><Save className="w-4 h-4" /> {t("saveChanges")}</>
                )}
            </button>
        </form>
    );
}