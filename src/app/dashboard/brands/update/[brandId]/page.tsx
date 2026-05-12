import { UpdateBrandForm } from "@/features/brands/update-brand/ui/update-brand-form";

interface UpdateBrandPageProps {
    params: Promise<{ brandId: string }>;
}

export default async function UpdateBrandPage({ params }: UpdateBrandPageProps) {
    const { brandId } = await params;

    return (
        <div className="mx-auto max-w-2xl p-8">
            <h1 className="mb-4 text-2xl font-bold">Update Brand</h1>
            <UpdateBrandForm brandId={brandId} />
        </div>
    );
}
