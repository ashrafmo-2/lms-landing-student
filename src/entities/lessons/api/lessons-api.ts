import { privateApi } from "@/shared/api";
import type { SubjectDetail, SubjectDetailResponse, FlatLesson } from "../model";

// ─── Fetch full subject detail (includes all units, lessons, exams) ───────────
// Endpoint: GET /api/v1/student/subjects/{id}
// Auth: Bearer token required (student must be subscribed)

export const getSubjectById = async (subjectId: string | number): Promise<SubjectDetail> => {
    const { data } = await privateApi.get<SubjectDetailResponse>(`/subjects/${subjectId}`);
    return data.data;
};

// ─── Mark a lesson as complete ────────────────────────────────────────────────
// Endpoint: POST /api/v1/student/lessons/complete
// Body: { lessonId: number }

export const completeLesson = async (lessonId: number): Promise<void> => {
    await privateApi.post("/lessons/complete", { lessonId });
};

// ─── Query keys ───────────────────────────────────────────────────────────────

export const lessonsQueryKeys = {
    subject: (subjectId: string | number) => ["subjects", "detail", subjectId] as const,
};

// ─── Helper: flatten all lessons from a subject into a navigable list ─────────

export function flattenLessons(subject: SubjectDetail): FlatLesson[] {
    const result: FlatLesson[] = [];

    for (const unit of subject.units) {
        // Unit-level lessons
        for (const lesson of unit.lessons) {
            result.push({ ...lesson, unitTitle: unit.title });
        }
        // Sub-unit lessons
        for (const subUnit of unit.subUnits) {
            for (const lesson of subUnit.lessons) {
                result.push({ ...lesson, unitTitle: unit.title, subUnitTitle: subUnit.title });
            }
        }
    }

    return result;
}
