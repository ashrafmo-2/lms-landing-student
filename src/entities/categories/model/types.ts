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
  /** 1 = subscribed, 0 = not subscribed. Only present when request includes a valid Bearer token. */
  isSubscribed: 0 | 1;
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

export type MyCategorySubject = {
  subjectId: number;
  title: string;
  shortDescription: string;
  image: string;
  completionPercentage: number;
};

export type MyCategory = {
  categoryId: number;
  title: string;
  priceBeforeDiscount: number;
  priceAfterDiscount: number | null;
  isAvailable: 0 | 1;
  endAt: string;
  countSubjects: number;
  countUnits: number;
  countLessons: number;
  completionPercentage: number;
  subjects: MyCategorySubject[];
};

export type MyCategoriesResponse = {
  success: boolean;
  message: string;
  data: {
    totalCategories: number;
    totalSubjects: number;
    totalLessons: number;
    categories: MyCategory[];
    pagination: CategoriesPagination;
  };
};

// ─── Category Details ─────────────────────────────────────────────────────────

/** A single lesson — VIDEO has a numeric duration (minutes), PDF has null */
export type Lesson = {
  lessonId: number;
  title: string;
  /** Duration in minutes for VIDEO lessons; null for PDF */
  duration: number | null;
  type: "VIDEO" | "PDF";
  lessonUrl: string;
  status: "ACTIVE" | "IN_ACTIVE";
  isCompleted: number; // 1 or 0
};

/** A single exam at any level (subject / unit / sub-unit) */
export type Exam = {
  examId: number;
  title: string;
  /** Duration in minutes */
  duration: number;
  isActive: "ACTIVE" | "IN_ACTIVE";
  totalMarks: number;
  isLimited: boolean;
  isCompleted: number; // 1 or 0
};

/** Sub-unit (child of a parent unit) */
export type SubUnit = {
  subUnitId: number;
  title: string;
  subUnitStatus: "ACTIVE" | "IN_ACTIVE";
  countLessons: number;
  countExams: number;
  lessons: Lesson[];
  exams: Exam[];
};

/** Parent unit — contains lessons, sub-units, and unit-level exams */
export type Unit = {
  unitId: number;
  title: string;
  unitStatus: "ACTIVE" | "IN_ACTIVE";
  countLessons: number;
  countSubUnits: number;
  countExams: number;
  lessons: Lesson[];
  subUnits: SubUnit[];
  exams: Exam[];
};

/** Subject inside a category or stand-alone detail */
export type Subject = {
  subjectId: number;
  title: string;
  shortDescription: string;
  longDescription?: string;
  image: string;
  teacherId?: number | string;
  teacherName: string;
  status: "ACTIVE" | "IN_ACTIVE";
  countUnits: number;
  countLessons: number;
  countExams: number;
  units: Unit[];
  /** Subject-level exams (not linked to any unit) */
  exams: Exam[];
};

export type SubjectDetailResponse = {
  success: boolean;
  message: string;
  data: Subject;
};

/** Full category detail returned by GET /public/categories/{id} */
export type CategoryDetail = {
  categoryId: number;
  name: string;
  description: string;
  priceBeforeDiscount: number;
  /** null when there is no discount */
  priceAfterDiscount: number | null;
  totalSubjects: number;
  totalUnits: number;
  totalLessons: number;
  totalExams: number;
  totalSubscribers: number;
  isSubscribed: number;
  subjects: Subject[];
};

export type CategoryDetailResponse = {
  success: boolean;
  message: string;
  data: CategoryDetail;
};
