import type { LocalizedName } from "@/shared/types/localized-name";

export type Category = LocalizedName & {
    id: string;
    parentId?: string;
    imageUrl?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type CategoryPayload = {
    nameAr: string;
    nameEn: string;
    nameIt: string;
    parentId?: string;
    imageUrl?: string;
};
