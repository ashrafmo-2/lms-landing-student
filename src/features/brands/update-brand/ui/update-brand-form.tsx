"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateBrand, getBrandById, brandQueryKeys } from "@/entities/brands/api";
import type { BrandPayload } from "@/entities/brands/model";
import { LocalizedNameFields } from "@/shared/ui";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/components/ui/button";
import type { LocalizedNameInput } from "@/shared/types/localized-name";

export function UpdateBrandForm({ brandId }: { brandId: string }) {
    const queryClient = useQueryClient();
    const [localizedName, setLocalizedName] = useState<LocalizedNameInput>({ nameAr: "", nameEn: "", nameIt: "" });
    const [imageUrl, setImageUrl] = useState("");

    const { data: brand, isLoading } = useQuery({
        queryKey: brandQueryKeys.detail(brandId),
        queryFn: () => getBrandById(brandId),
        enabled: !!brandId,
    });

    const updateMutation = useMutation({
        mutationFn: (payload: BrandPayload) => updateBrand(brandId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: brandQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: brandQueryKeys.detail(brandId) });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({
            nameAr: localizedName.nameAr || brand?.nameAr || "",
            nameEn: localizedName.nameEn || brand?.nameEn || "",
            nameIt: localizedName.nameIt || brand?.nameIt || "",
            imageUrl: imageUrl || brand?.imageUrl,
        });
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <LocalizedNameFields
                values={{ nameAr: localizedName.nameAr || brand?.nameAr || "", nameEn: localizedName.nameEn || brand?.nameEn || "", nameIt: localizedName.nameIt || brand?.nameIt || "" }}
                onChange={(field, value) => setLocalizedName((prev) => ({ ...prev, [field]: value }))}
            />
            <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" value={imageUrl || brand?.imageUrl || ""} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
            </div>
            <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update Brand"}
            </Button>
        </form>
    );
}
