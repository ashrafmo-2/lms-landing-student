import axios from "axios";
import type { Brand, BrandPayload } from "../model";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const getBrands = async (): Promise<Brand[]> => {
    const { data } = await axios.get(`${API_URL}/brands`);
    return data;
};

export const getBrandById = async (id: string): Promise<Brand> => {
    const { data } = await axios.get(`${API_URL}/brands/${id}`);
    return data;
};

export const createBrand = async (payload: BrandPayload): Promise<Brand> => {
    const { data } = await axios.post(`${API_URL}/brands`, payload);
    return data;
};

export const updateBrand = async (id: string, payload: BrandPayload): Promise<Brand> => {
    const { data } = await axios.put(`${API_URL}/brands/${id}`, payload);
    return data;
};

export const deleteBrand = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/brands/${id}`);
};

export const queryKeys = {
    all: ["brands"] as const,
    detail: (id: string) => ["brands", id] as const,
};
