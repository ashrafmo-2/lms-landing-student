import { privateApi } from "@/shared/api";
import type { SubscriptionsResponse } from "../model";

export type GetSubscriptionsParams = {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  perPage?: number;
  page?: number;
};

export const getMySubscriptions = async (
  params: GetSubscriptionsParams = {},
): Promise<SubscriptionsResponse["data"]> => {
  const { search, dateFrom, dateTo, perPage = 10, page = 1 } = params;

  const { data } = await privateApi.get<SubscriptionsResponse>(
    "/my-subscriptions",
    {
      params: {
        ...(search ? { search } : {}),
        ...(dateFrom ? { dateFrom } : {}),
        ...(dateTo ? { dateTo } : {}),
        perPage,
        page,
      },
    },
  );

  return data.data;
};

export const subscriptionsQueryKeys = {
  all: ["subscriptions"] as const,
  my: (params?: GetSubscriptionsParams) =>
    ["subscriptions", "my", params] as const,
};
