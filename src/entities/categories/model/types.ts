export type Category = {
    categoryId: number;
    name: string;
    description: string;
    totalSubjects: number;
    totalUnits: number;
    totalLessons: number;
    subjectNames: string[];
    priceBeforeDiscount: number;
    priceAfterDiscount: number;
    isSubscribed: number;
};

export type CategoriesPagination = {
    total: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
};

export type CategoriesResponse = {
    success: boolean;
    message: string;
    data: {
        categories: Category[];
        pagination: CategoriesPagination;
    };
};

// ─── Category Details ─────────────────────────────────────────────────────────

export type Lesson = {
    lessonId: number;
    title: string;
    duration: string; // e.g. "45 دقيقة"
    type: "video" | "pdf" | "quiz";
};

export type Unit = {
    unitId: number;
    title: string;
    lessons: Lesson[];
};

export type Subject = {
    subjectId: number;
    name: string;
    doctorName: string;
    totalUnits: number;
    totalLessons: number;
    totalExams: number;
    units: Unit[];
};

export type CategoryDetail = {
    categoryId: number;
    name: string;
    description: string;
    tag: string;
    totalSubjects: number;
    totalUnits: number;
    totalLessons: number;
    totalExams: number;
    priceBeforeDiscount: number;
    priceAfterDiscount: number;
    isSubscribed: number;
    subjects: Subject[];
};

export type CategoryDetailResponse = {
    success: boolean;
    message: string;
    data: CategoryDetail;
};
