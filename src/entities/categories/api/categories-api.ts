import type {
  SubjectDetail,
  SubjectDetailResponse,
} from "@/entities/lessons/model";
import { BASE_URL, privateApi } from "@/shared/api";
import type {
  CategoriesResponse,
  Category,
  CategoryDetail,
  CategoryDetailResponse,
  MyCategoriesResponse,
} from "../model";

const publicBase = BASE_URL.replace(/\/student$/, "/public");

export type GetCategoriesParams = {
  search?: string;
  perPage?: number;
  page?: number;
};

export const getPublicCategories = async (
  params: GetCategoriesParams = {},
): Promise<{
  categories: Category[];
  pagination: CategoriesResponse["data"]["pagination"];
}> => {
  const { search, perPage = 12, page = 1 } = params;

  // Use privateApi so the Bearer token is attached when the student is logged in.
  // The interceptor skips the header silently when no token exists, so this works
  // for both authenticated and unauthenticated requests.
  try {
    const { data } = await privateApi.get<CategoriesResponse>(
      `${publicBase}/categories`,
      {
        params: {
          ...(search ? { "filter[search]": search } : {}),
          perPage,
          page,
        },
      },
    );

    if (data.data?.categories) {
      return data.data;
    }
  } catch {
    // Keep the landing usable if the public API is temporarily unavailable.
  }

  return {
    categories: [],
    pagination: {
      total: 0,
      perPage,
      currentPage: page,
      totalPages: 1,
    },
  };
};

export const getMyCategories = async (
  params: Pick<GetCategoriesParams, "perPage" | "page"> = {},
): Promise<MyCategoriesResponse["data"]> => {
  const { perPage = 12, page = 1 } = params;

  const { data } = await privateApi.get<MyCategoriesResponse>(
    "/categories/my-categories",
    {
      params: {
        perPage,
        page,
      },
    },
  );

  return data.data;
};

// ─── Detail ───────────────────────────────────────────────────────────────────
// Uses privateApi so the Authorization header is sent when the student is logged
// in — this makes `isSubscribed` reflect the real subscription status.
// Falls back gracefully when no token is present (interceptor skips the header).

export const getCategoryById = async (id: number): Promise<CategoryDetail> => {
  const { data } = await privateApi.get<CategoryDetailResponse>(
    `${publicBase}/categories/${id}`,
  );
  return data.data;
};

export const getSubjectDetail = async (
  id: number | string,
): Promise<SubjectDetail> => {
  const { data } = await privateApi.get<SubjectDetailResponse>(
    `/subjects/${id}`,
  );
  return data.data;
};

// ─── Query keys ───────────────────────────────────────────────────────────────

export const categoriesQueryKeys = {
  all: ["categories"] as const,
  public: (params?: GetCategoriesParams) =>
    ["categories", "public", params] as const,
  my: (params?: Pick<GetCategoriesParams, "perPage" | "page">) =>
    ["categories", "my", params] as const,
  detail: (id: number) => ["categories", "detail", id] as const,
  subjectDetail: (id: number | string) => ["subjects", "detail", id] as const,
};
