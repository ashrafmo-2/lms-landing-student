import { BASE_URL, privateApi, publicApi } from "@/shared/api";
import type { StudentWorkshop, Workshop, WorkshopPaymentStatus, WorkshopSubmission, WorkshopTask } from "../model/types";

const publicBase = BASE_URL.replace(/\/student$/, "/public");

export const fallbackWorkshop: Workshop = {
    workshopId: 1,
    title: "Full-Stack Workshop: Build and Ship",
    description: "ورشة تطبيقية للطلاب لبناء مشروع كامل بخطوات واضحة، جلسات عملية، وتاسكات أسبوعية مع Feedback.",
    startsAt: "2026-07-10",
    endsAt: "2026-08-07",
    duration: "4 أسابيع",
    price: 0,
    isFree: true,
    seatsLimit: 40,
    availableSeats: 12,
    deliveryMode: "hybrid",
    status: "registration_open",
    registrationStatus: "open",
    language: "ar",
    level: "beginner",
    studentsCount: 28,
    audience: ["طلاب مبتدئين", "Junior developers", "أي طالب محتاج تجربة تطبيقية منظمة"],
    outcomes: ["Roadmap واضحة", "مشروع نهائي قابل للعرض", "Feedback على التسليمات", "Badges عند إكمال المراحل"],
    instructors: [{ id: 2, name: "Ahmed Samir", title: "Lead Instructor" }],
    roadmap: [
        { milestoneId: 1, title: "مرحلة التجهيز", description: "إعداد الأدوات وفهم خطة الورشة.", startsAt: "2026-07-10", endsAt: "2026-07-12", status: "active", order: 1 },
        { milestoneId: 2, title: "مرحلة الأساسيات", description: "أساسيات الواجهة والـ API.", startsAt: "2026-07-13", endsAt: "2026-07-19", status: "upcoming", order: 2 },
        { milestoneId: 3, title: "مرحلة التطبيق العملي", description: "تنفيذ أجزاء حقيقية خطوة بخطوة.", startsAt: "2026-07-20", endsAt: "2026-07-27", status: "locked", order: 3 },
        { milestoneId: 4, title: "مرحلة المشروع", description: "تجميع المخرجات في مشروع نهائي.", startsAt: "2026-07-28", endsAt: "2026-08-04", status: "locked", order: 4 },
        { milestoneId: 5, title: "المراجعة والتسليم النهائي", description: "تحسين وتسليم ومراجعة.", startsAt: "2026-08-05", endsAt: "2026-08-07", status: "locked", order: 5 },
    ],
    sessions: [
        { sessionId: 1, title: "Kickoff and roadmap", date: "2026-07-10", time: "19:00", durationMinutes: 90, type: "live", status: "upcoming" },
        { sessionId: 2, title: "Data and API foundations", date: "2026-07-14", time: "19:00", durationMinutes: 120, type: "live", status: "upcoming" },
        { sessionId: 3, title: "Project review", date: "2026-08-05", time: "19:00", durationMinutes: 90, type: "recorded", status: "upcoming" },
    ],
    tasks: [
        { taskId: 1, title: "Pre-work checklist", description: "ثبت الأدوات وجهز حساباتك.", instructions: "علّم على كل خطوة بعد الانتهاء.", deadline: "2026-07-12T20:00:00.000Z", difficulty: "beginner", estimatedTime: "45 دقيقة", submissionType: "checklist", status: "not_started", checklist: ["ثبت Node.js", "جهز GitHub", "افتح المشروع محليا"] },
        { taskId: 2, title: "Weekly assignment", description: "ارفع رابط تصميم الـ API.", instructions: "ارفع رابط repository أو gist فيه التصميم.", deadline: "2026-07-18T20:00:00.000Z", difficulty: "intermediate", estimatedTime: "ساعتين", submissionType: "github", status: "in_progress", rubric: ["وضوح endpoints", "تنظيم الملفات", "توثيق مختصر"] },
        { taskId: 3, title: "Final project", description: "سلم رابط المشروع النهائي.", instructions: "يمكنك إرسال رابط GitHub أو رفع ملف مضغوط.", deadline: "2026-08-07T20:00:00.000Z", difficulty: "advanced", estimatedTime: "6 ساعات", submissionType: "file", status: "not_started" },
    ],
    faq: [
        { question: "هل الورشة Live؟", answer: "Hybrid، الجلسات الأساسية Live والتسجيلات متاحة بعد كل جلسة." },
        { question: "هل فيه مشروع نهائي؟", answer: "نعم، المشروع النهائي هو مخرج الورشة الأساسي." },
    ],
};

export async function getPublicWorkshops(): Promise<Workshop[]> {
    try {
        const { data } = await publicApi.get(`${publicBase}/workshops`);
        return data.data.workshops ?? [];
    } catch {
        return [fallbackWorkshop];
    }
}

export async function getPublicWorkshop(workshopId: string | number): Promise<Workshop> {
    try {
        const { data } = await publicApi.get(`${publicBase}/workshops/${workshopId}`);
        return data.data;
    } catch {
        return fallbackWorkshop;
    }
}

export async function getStudentWorkshops(): Promise<StudentWorkshop[]> {
    try {
        const { data } = await privateApi.get("/workshops/dashboard");
        return data.data.workshops ?? [];
    } catch {
        return [{
            enrollmentId: 1,
            status: "active",
            progress: 42,
            currentMilestone: "مرحلة التجهيز",
            badges: ["Starter", "On Track"],
            workshop: fallbackWorkshop,
            tasks: fallbackWorkshop.tasks ?? [],
        }];
    }
}

function normalizeTask(task: Record<string, unknown>): WorkshopTask {
    return {
        taskId: Number(task.taskId ?? task.id),
        title: String(task.title ?? ""),
        description: task.description as string | undefined,
        instructions: task.instructions as string | undefined,
        deadline: task.deadline as string | undefined,
        points: task.points as number | undefined,
        difficulty: (task.difficulty as WorkshopTask["difficulty"]) ?? "beginner",
        estimatedTime: (task.estimatedTime ?? task.estimated_time) as string | undefined,
        submissionType: ((task.submissionType ?? task.submission_type) as WorkshopTask["submissionType"]) ?? "link",
        status: task.status as string | undefined,
        attachments: (task.attachments as WorkshopTask["attachments"]) ?? [],
        rubric: (task.rubric as string[]) ?? [],
        checklist: (task.checklist as string[]) ?? [],
        feedback: task.feedback as string | undefined,
        score: task.score as number | undefined,
    };
}

export async function getStudentTask(taskId: string | number): Promise<{ task: WorkshopTask; submission?: WorkshopSubmission | null }> {
    try {
        const { data } = await privateApi.get(`/workshop-tasks/${taskId}`);
        return {
            task: normalizeTask(data.data.task),
            submission: data.data.submission ?? null,
        };
    } catch {
        return { task: fallbackWorkshop.tasks?.find((task) => task.taskId === Number(taskId)) ?? fallbackWorkshop.tasks![0] };
    }
}

export async function submitStudentTask(taskId: string | number, payload: FormData | Record<string, unknown>) {
    return privateApi.post(`/workshop-tasks/${taskId}/submit`, payload);
}

export async function getWorkshopPaymentStatus(workshopSlug: string | number): Promise<WorkshopPaymentStatus> {
    const { data } = await privateApi.get(`/payment-requests/${workshopSlug}`);
    return data.data;
}

export async function submitWorkshopPaymentRequest(workshopSlug: string | number, payload: FormData) {
    const { data } = await privateApi.post(`/payment-requests/${workshopSlug}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
}
