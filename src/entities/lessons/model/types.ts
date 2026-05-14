export type LessonType = "VIDEO" | "PDF";

// ─── Lesson as returned inside a subject detail response ──────────────────────
export type LessonItem = {
    lessonId: number;
    title: string;
    type: LessonType;
    /** Duration in minutes for VIDEO; null for PDF */
    duration: number | null;
    /** Full URL to the video/PDF file. Empty string if not uploaded yet */
    lessonUrl: string;
    status: "ACTIVE" | "IN_ACTIVE";
    /** 1 = student completed this lesson, 0 = not yet */
    isCompleted: 0 | 1;
};

// ─── Exam as returned inside a subject detail response ────────────────────────
export type ExamItem = {
    examId: number;
    title: string;
    isActive: "ACTIVE" | "IN_ACTIVE";
    /** Duration in minutes */
    duration: number;
    totalMarks: number;
    isLimited: boolean;
    /** 1 = student submitted this exam, 0 = not yet */
    isCompleted: 0 | 1;
};

// ─── Sub-unit ─────────────────────────────────────────────────────────────────
export type SubUnitDetail = {
    subUnitId: number;
    title: string;
    subUnitStatus: "ACTIVE" | "IN_ACTIVE";
    countLessons: number;
    countExams: number;
    lessons: LessonItem[];
    exams: ExamItem[];
};

// ─── Unit ─────────────────────────────────────────────────────────────────────
export type UnitDetail = {
    unitId: number;
    title: string;
    unitStatus: "ACTIVE" | "IN_ACTIVE";
    countLessons: number;
    countSubUnits: number;
    countExams: number;
    lessons: LessonItem[];
    subUnits: SubUnitDetail[];
    exams: ExamItem[];
};

// ─── Subject detail (full response data) ─────────────────────────────────────
export type SubjectDetail = {
    subjectId: number;
    title: string;
    shortDescription: string;
    longDescription: string;
    image: string;
    teacherId: number | string;
    teacherName: string;
    status: "ACTIVE" | "IN_ACTIVE";
    countUnits: number;
    countLessons: number;
    countExams: number;
    units: UnitDetail[];
    /** Subject-level exams (not linked to any unit) */
    exams: ExamItem[];
};

export type SubjectDetailResponse = {
    success: boolean;
    message: string;
    data: SubjectDetail;
};

// ─── Flat lesson list helper (for sidebar navigation) ────────────────────────
export type FlatLesson = LessonItem & {
    unitTitle: string;
    subUnitTitle?: string;
};
