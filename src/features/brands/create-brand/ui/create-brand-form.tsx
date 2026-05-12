"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBrand, brandQueryKeys } from "@/entities/brands/api";
import type { BrandPayload } from "@/entities/brands/model";
import { LocalizedNameFields } from "@/shared/ui";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/components/ui/button";
import type { LocalizedNameInput } from "@/shared/types/localized-name";

export function CreateBrandForm() {
    const queryClient = useQueryClient();
    const [localizedName, setLocalizedName] = useState<LocalizedNameInput>({ nameAr: "", nameEn: "", nameIt: "" });
    const [imageUrl, setImageUrl] = useState("");

    const createMutation = useMutation({
        mutationFn: (payload: BrandPayload) => createBrand(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: brandQueryKeys.all });
            setLocalizedName({ nameAr: "", nameEn: "", nameIt: "" });
            setImageUrl("");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({ ...localizedName, imageUrl: imageUrl || undefined });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <LocalizedNameFields values={localizedName} onChange={(field, value) => setLocalizedName((prev) => ({ ...prev, [field]: value }))} />
            <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
            </div>
            <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Brand"}
            </Button>
        </form>
    );
}
