import axios from "axios";
import type { Category, CategoryPayload } from "../model";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const getCategories = async (): Promise<Category[]> => {
    const { data } = await axios.get(`${API_URL}/categories`);
    return data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
    const { data } = await axios.get(`${API_URL}/categories/${id}`);
    return data;
};

export const createCategory = async (payload: CategoryPayload): Promise<Category> => {
    const { data } = await axios.post(`${API_URL}/categories`, payload);
    return data;
};

export const updateCategory = async (id: string, payload: CategoryPayload): Promise<Category> => {
    const { data } = await axios.put(`${API_URL}/categories/${id}`, payload);
    return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/categories/${id}`);
};

export const queryKeys = {
    all: ["categories"] as const,
    detail: (id: string) => ["categories", id] as const,
};
