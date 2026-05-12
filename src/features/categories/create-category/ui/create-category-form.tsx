"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategory, getCategories, categoryQueryKeys } from "@/entities/categories/api";
import type { CategoryPayload } from "@/entities/categories/model";
import { LocalizedNameFields } from "@/shared/ui";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/components/ui/button";
import type { LocalizedNameInput } from "@/shared/types/localized-name";

export function CreateCategoryForm() {
    const queryClient = useQueryClient();
    const [localizedName, setLocalizedName] = useState<LocalizedNameInput>({ nameAr: "", nameEn: "", nameIt: "" });
    const [parentId, setParentId] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const { data: categories } = useQuery({ queryKey: categoryQueryKeys.all, queryFn: getCategories });

    const createMutation = useMutation({
        mutationFn: (payload: CategoryPayload) => createCategory(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all });
            setLocalizedName({ nameAr: "", nameEn: "", nameIt: "" });
            setParentId(""); setImageUrl("");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({ ...localizedName, parentId: parentId || undefined, imageUrl: imageUrl || undefined });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <LocalizedNameFields values={localizedName} onChange={(field, value) => setLocalizedName((prev) => ({ ...prev, [field]: value }))} />
            <div className="space-y-2">
                <Label htmlFor="parentId">Parent Category (Optional)</Label>
                <select id="parentId" value={parentId} onChange={(e) => setParentId(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                    <option value="">No Parent</option>
                    {categories?.map((cat) => <option key={cat.id} value={cat.id}>{cat.nameEn}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
            </div>
            <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Category"}
            </Button>
        </form>
    );
}
