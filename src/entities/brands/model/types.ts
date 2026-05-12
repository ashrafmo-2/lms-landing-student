import type { LocalizedName } from "@/shared/types/localized-name";

export type Brand = LocalizedName & {
    id: string;
    imageUrl?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type BrandPayload = {
    nameAr: string;
    nameEn: string;
    nameIt: string;
    imageUrl?: string;
};
