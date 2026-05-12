import axios from "axios";
import type { Product } from "../model/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const getProducts = async (): Promise<Product[]> => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};
