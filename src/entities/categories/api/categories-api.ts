import { publicApi, BASE_URL } from "@/shared/api";
import type {
    CategoriesResponse,
    Category,
    CategoryDetail,
    CategoryDetailResponse,
} from "../model";

const publicBase = BASE_URL.replace(/\/student$/, "/public");

// ─── List ─────────────────────────────────────────────────────────────────────

export type GetCategoriesParams = {
    search?: string;
    perPage?: number;
    page?: number;
};

export const getPublicCategories = async (
    params: GetCategoriesParams = {}
): Promise<{ categories: Category[]; pagination: CategoriesResponse["data"]["pagination"] }> => {
    const { search, perPage = 12, page = 1 } = params;

    const { data } = await publicApi.get<CategoriesResponse>(`${publicBase}/categories`, {
        params: {
            ...(search ? { "filter[search]": search } : {}),
            perPage,
            page,
        },
    });

    return data.data;
};

// ─── Detail (mock until API is ready) ────────────────────────────────────────

const MOCK_DETAIL: Record<number, CategoryDetail> = {
    1: {
        categoryId: 1,
        name: "باقة الصف الثالث الثانوي (علمي رياضة)",
        description:
            "مسار شامل يغطي جميع مقررات شعبة الرياضيات بأحدث طرق الشرح والامتحانات التفاعلية.",
        tag: "مسار متكامل",
        totalSubjects: 6,
        totalUnits: 42,
        totalLessons: 150,
        totalExams: 36,
        priceBeforeDiscount: 1200,
        priceAfterDiscount: 850,
        isSubscribed: 0,
        subjects: [
            {
                subjectId: 1,
                name: "تفاضل وتكامل",
                doctorName: "د. أحمد السيد",
                totalUnits: 8,
                totalLessons: 32,
                totalExams: 8,
                units: [
                    {
                        unitId: 1,
                        title: "النهايات والاتصال",
                        lessons: [
                            { lessonId: 1, title: "مقدمة في النهايات", duration: "45 دقيقة", type: "video" },
                            { lessonId: 2, title: "قوانين النهايات", duration: "50 دقيقة", type: "video" },
                            { lessonId: 3, title: "ملخص الوحدة", duration: "—", type: "pdf" },
                            { lessonId: 4, title: "اختبار الوحدة الأولى", duration: "30 دقيقة", type: "quiz" },
                        ],
                    },
                    {
                        unitId: 2,
                        title: "المشتقات",
                        lessons: [
                            { lessonId: 5, title: "تعريف المشتقة", duration: "40 دقيقة", type: "video" },
                            { lessonId: 6, title: "قواعد الاشتقاق", duration: "55 دقيقة", type: "video" },
                            { lessonId: 7, title: "تطبيقات المشتقة", duration: "60 دقيقة", type: "video" },
                            { lessonId: 8, title: "اختبار المشتقات", duration: "30 دقيقة", type: "quiz" },
                        ],
                    },
                ],
            },
            {
                subjectId: 2,
                name: "جبر وهندسة فراغية",
                doctorName: "د. محمد عبدالله",
                totalUnits: 7,
                totalLessons: 28,
                totalExams: 7,
                units: [
                    {
                        unitId: 3,
                        title: "المصفوفات والمحددات",
                        lessons: [
                            { lessonId: 9, title: "تعريف المصفوفات", duration: "35 دقيقة", type: "video" },
                            { lessonId: 10, title: "عمليات المصفوفات", duration: "50 دقيقة", type: "video" },
                            { lessonId: 11, title: "اختبار المصفوفات", duration: "25 دقيقة", type: "quiz" },
                        ],
                    },
                    {
                        unitId: 4,
                        title: "الهندسة الفراغية",
                        lessons: [
                            { lessonId: 12, title: "الإحداثيات الفراغية", duration: "45 دقيقة", type: "video" },
                            { lessonId: 13, title: "المستوى في الفراغ", duration: "40 دقيقة", type: "video" },
                            { lessonId: 14, title: "ملخص الهندسة الفراغية", duration: "—", type: "pdf" },
                        ],
                    },
                ],
            },
            {
                subjectId: 3,
                name: "فيزياء",
                doctorName: "د. سارة إبراهيم",
                totalUnits: 6,
                totalLessons: 24,
                totalExams: 6,
                units: [
                    {
                        unitId: 5,
                        title: "الديناميكا",
                        lessons: [
                            { lessonId: 15, title: "قوانين نيوتن", duration: "50 دقيقة", type: "video" },
                            { lessonId: 16, title: "الشغل والطاقة", duration: "45 دقيقة", type: "video" },
                            { lessonId: 17, title: "اختبار الديناميكا", duration: "30 دقيقة", type: "quiz" },
                        ],
                    },
                ],
            },
            {
                subjectId: 4,
                name: "كيمياء",
                doctorName: "د. خالد منصور",
                totalUnits: 5,
                totalLessons: 20,
                totalExams: 5,
                units: [
                    {
                        unitId: 6,
                        title: "الجدول الدوري",
                        lessons: [
                            { lessonId: 18, title: "تصنيف العناصر", duration: "40 دقيقة", type: "video" },
                            { lessonId: 19, title: "الخواص الدورية", duration: "45 دقيقة", type: "video" },
                            { lessonId: 20, title: "اختبار الجدول الدوري", duration: "25 دقيقة", type: "quiz" },
                        ],
                    },
                ],
            },
            {
                subjectId: 5,
                name: "أحياء",
                doctorName: "د. نورا حسن",
                totalUnits: 8,
                totalLessons: 28,
                totalExams: 6,
                units: [
                    {
                        unitId: 7,
                        title: "الخلية وتركيبها",
                        lessons: [
                            { lessonId: 21, title: "مكونات الخلية", duration: "35 دقيقة", type: "video" },
                            { lessonId: 22, title: "الغشاء الخلوي", duration: "40 دقيقة", type: "video" },
                            { lessonId: 23, title: "ملخص الخلية", duration: "—", type: "pdf" },
                        ],
                    },
                ],
            },
            {
                subjectId: 6,
                name: "لغة عربية",
                doctorName: "د. عمر فاروق",
                totalUnits: 8,
                totalLessons: 18,
                totalExams: 4,
                units: [
                    {
                        unitId: 8,
                        title: "النحو والصرف",
                        lessons: [
                            { lessonId: 24, title: "الجملة الاسمية", duration: "30 دقيقة", type: "video" },
                            { lessonId: 25, title: "الجملة الفعلية", duration: "30 دقيقة", type: "video" },
                            { lessonId: 26, title: "اختبار النحو", duration: "20 دقيقة", type: "quiz" },
                        ],
                    },
                ],
            },
        ],
    },
};

// Default fallback for unknown IDs
function buildFallbackDetail(id: number): CategoryDetail {
    return {
        categoryId: id,
        name: "مسار تعليمي",
        description: "مسار شامل يغطي جميع المقررات بأحدث طرق الشرح والامتحانات التفاعلية.",
        tag: "مسار متكامل",
        totalSubjects: 3,
        totalUnits: 12,
        totalLessons: 48,
        totalExams: 12,
        priceBeforeDiscount: 800,
        priceAfterDiscount: 600,
        isSubscribed: 0,
        subjects: [
            {
                subjectId: 101,
                name: "المادة الأولى",
                doctorName: "د. أحمد محمد",
                totalUnits: 4,
                totalLessons: 16,
                totalExams: 4,
                units: [
                    {
                        unitId: 101,
                        title: "الوحدة الأولى",
                        lessons: [
                            { lessonId: 1001, title: "الدرس الأول", duration: "40 دقيقة", type: "video" },
                            { lessonId: 1002, title: "الدرس الثاني", duration: "45 دقيقة", type: "video" },
                            { lessonId: 1003, title: "اختبار الوحدة", duration: "20 دقيقة", type: "quiz" },
                        ],
                    },
                ],
            },
        ],
    };
}

export const getCategoryById = async (id: number): Promise<CategoryDetail> => {
    // TODO: replace with real API call when ready
    // const { data } = await publicApi.get<CategoryDetailResponse>(`${publicBase}/categories/${id}`);
    // return data.data;

    await new Promise((r) => setTimeout(r, 400)); // simulate network delay
    return MOCK_DETAIL[id] ?? buildFallbackDetail(id);
};

// ─── Query keys ───────────────────────────────────────────────────────────────

export const categoriesQueryKeys = {
    all: ["categories"] as const,
    public: (params?: GetCategoriesParams) => ["categories", "public", params] as const,
    detail: (id: number) => ["categories", "detail", id] as const,
};
