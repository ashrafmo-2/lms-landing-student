import { UpdateCategoryForm } from "@/features/categories/update-category/ui/update-category-form";

interface UpdateCategoryPageProps {
    params: Promise<{ categoryId: string }>;
}

export default async function UpdateCategoryPage({
    params,
}: UpdateCategoryPageProps) {
    const { categoryId } = await params;

    return (
        <div className="mx-auto max-w-2xl p-8">
            <h1 className="mb-4 text-2xl font-bold">Update Category</h1>
            <UpdateCategoryForm categoryId={categoryId} />
        </div>
    );
}
