import { privateApi } from "@/shared/api";
import type { AchievementsResponse } from "../model";

export const getAchievements = async (): Promise<
  AchievementsResponse["data"]
> => {
  const { data } = await privateApi.get<AchievementsResponse>("/achievements");

  return data.data;
};

export const achievementsQueryKeys = {
  all: ["achievements"] as const,
  mine: ["achievements", "mine"] as const,
};
