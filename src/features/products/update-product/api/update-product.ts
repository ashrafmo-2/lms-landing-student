import type { Product, ProductPayload } from "@/entities/products";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

type UpdateProductParams = { id: string; payload: ProductPayload };

export const updateProduct = async ({ id, payload }: UpdateProductParams): Promise<Product> => {
    const response = await axios.put(`${API_URL}/products/${id}`, payload);
    return response.data;
};
