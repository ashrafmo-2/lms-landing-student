"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts, productQueryKeys, ProductCard, type Product } from "@/entities/products";

export default function AllProductsPage() {
    const { data, isLoading, isError } = useQuery<Product[]>({
        queryKey: productQueryKeys.lists(),
        queryFn: getProducts,
    });

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Something went wrong</p>;

    return (
        <div className="p-8">
            <h1 className="mb-6 text-2xl font-bold">All Products</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {data?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
