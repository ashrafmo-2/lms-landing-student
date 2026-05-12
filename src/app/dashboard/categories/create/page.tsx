import { CreateCategoryForm } from "@/features/categories/create-category/ui/create-category-form";

export default function CreateCategoryPage() {
    return (
        <div className="mx-auto max-w-2xl p-8">
            <h1 className="mb-4 text-2xl font-bold">Create Category</h1>
            <CreateCategoryForm />
        </div>
    );
}
