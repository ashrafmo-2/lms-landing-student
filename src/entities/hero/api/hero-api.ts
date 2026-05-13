import { publicApi, BASE_URL } from "@/shared/api";
import type { HeroStats } from "../model";

// The hero endpoint lives under /api/v1/public, not /api/v1/student
const publicBase = BASE_URL.replace(/\/student$/, "/public");

export const getHeroStats = async (): Promise<HeroStats> => {
    const { data } = await publicApi.get<HeroStats>(`${publicBase}/hero`);
    return data.data;
};

export const heroQueryKeys = {
    stats: ["hero", "stats"] as const,
};
