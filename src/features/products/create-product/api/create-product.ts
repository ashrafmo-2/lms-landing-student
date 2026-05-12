import type { Product, ProductPayload } from "@/entities/products";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const createProduct = async (payload: ProductPayload): Promise<Product> => {
    const response = await axios.post(`${API_URL}/products`, payload);
    return response.data;
};
