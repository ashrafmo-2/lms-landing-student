"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getCategories, categoryQueryKeys } from "@/entities/categories/api";

export function AllCategoriesPage() {
    const { data: categories, isLoading } = useQuery({
        queryKey: categoryQueryKeys.all,
        queryFn: getCategories,
    });

    if (isLoading) return <div className="p-8 text-center text-[#64748b]">Loading...</div>;

    return (
        <div className="space-y-6 p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">All Categories</h1>
                <Link href="/dashboard/categories/create" className="rounded-md bg-[#6c3aff] px-4 py-2 text-sm font-medium text-white hover:bg-[#5228e8]">
                    Create New Category
                </Link>
            </div>
            <div className="rounded-md border">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-3 text-left">Name (AR)</th>
                            <th className="p-3 text-left">Name (EN)</th>
                            <th className="p-3 text-left">Name (IT)</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories?.map((category) => (
                            <tr key={category.id} className="border-b">
                                <td className="p-3" dir="rtl">{category.nameAr}</td>
                                <td className="p-3">{category.nameEn}</td>
                                <td className="p-3">{category.nameIt}</td>
                                <td className="p-3">
                                    <Link href={`/dashboard/categories/update/${category.id}`} className="text-[#6c3aff] hover:underline">Edit</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
