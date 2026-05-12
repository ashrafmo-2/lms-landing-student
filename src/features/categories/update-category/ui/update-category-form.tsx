"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateCategory, getCategoryById, getCategories, categoryQueryKeys } from "@/entities/categories/api";
import type { CategoryPayload } from "@/entities/categories/model";
import { LocalizedNameFields } from "@/shared/ui";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/components/ui/button";
import type { LocalizedNameInput } from "@/shared/types/localized-name";

export function UpdateCategoryForm({ categoryId }: { categoryId: string }) {
    const queryClient = useQueryClient();
    const [localizedName, setLocalizedName] = useState<LocalizedNameInput>({ nameAr: "", nameEn: "", nameIt: "" });
    const [parentId, setParentId] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const { data: category, isLoading } = useQuery({ queryKey: categoryQueryKeys.detail(categoryId), queryFn: () => getCategoryById(categoryId), enabled: !!categoryId });
    const { data: categories } = useQuery({ queryKey: categoryQueryKeys.all, queryFn: getCategories });

    const updateMutation = useMutation({
        mutationFn: (payload: CategoryPayload) => updateCategory(categoryId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: categoryQueryKeys.detail(categoryId) });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({
            nameAr: localizedName.nameAr || category?.nameAr || "",
            nameEn: localizedName.nameEn || category?.nameEn || "",
            nameIt: localizedName.nameIt || category?.nameIt || "",
            parentId: parentId || category?.parentId,
            imageUrl: imageUrl || category?.imageUrl,
        });
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <LocalizedNameFields
                values={{ nameAr: localizedName.nameAr || category?.nameAr || "", nameEn: localizedName.nameEn || category?.nameEn || "", nameIt: localizedName.nameIt || category?.nameIt || "" }}
                onChange={(field, value) => setLocalizedName((prev) => ({ ...prev, [field]: value }))}
            />
            <div className="space-y-2">
                <Label htmlFor="parentId">Parent Category (Optional)</Label>
                <select id="parentId" value={parentId || category?.parentId || ""} onChange={(e) => setParentId(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                    <option value="">No Parent</option>
                    {categories?.filter((c) => c.id !== categoryId).map((cat) => <option key={cat.id} value={cat.id}>{cat.nameEn}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" value={imageUrl || category?.imageUrl || ""} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
            </div>
            <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update Category"}
            </Button>
        </form>
    );
}
