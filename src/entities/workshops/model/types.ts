export type WorkshopStatus = "draft" | "published" | "registration_open" | "registration_closed" | "in_progress" | "completed" | "archived";
export type RegistrationStatus = "open" | "closed" | "coming_soon";
export type DeliveryMode = "live" | "recorded" | "hybrid";

export type WorkshopMilestone = {
    milestoneId: number;
    title: string;
    description?: string;
    startsAt?: string;
    endsAt?: string;
    status: "locked" | "upcoming" | "active" | "completed";
    order: number;
};

export type WorkshopSession = {
    sessionId: number;
    title: string;
    description?: string;
    date?: string;
    time?: string;
    durationMinutes?: number;
    type: DeliveryMode;
    status: "upcoming" | "available" | "ended";
};

export type WorkshopTask = {
    taskId: number;
    title: string;
    description?: string;
    instructions?: string;
    deadline?: string;
    points?: number;
    difficulty: "beginner" | "intermediate" | "advanced";
    estimatedTime?: string;
    submissionType: "link" | "file" | "text" | "quiz" | "checklist";
    status?: string;
    feedback?: string;
    score?: number;
};

export type Workshop = {
    workshopId: number;
    title: string;
    description?: string;
    bannerUrl?: string;
    startsAt?: string;
    endsAt?: string;
    duration?: string;
    price: number;
    isFree: boolean;
    seatsLimit?: number;
    availableSeats?: number;
    deliveryMode: DeliveryMode;
    status: WorkshopStatus;
    registrationStatus: RegistrationStatus;
    language: string;
    level: "beginner" | "intermediate" | "advanced";
    outcomes: string[];
    audience: string[];
    faq: { question: string; answer: string }[];
    instructors?: { userId: number; name: string; role: string; avatar?: string }[];
    roadmap?: WorkshopMilestone[];
    sessions?: WorkshopSession[];
    tasks?: WorkshopTask[];
    studentsCount?: number;
};

export type StudentWorkshop = {
    enrollmentId: number;
    status: string;
    progress: number;
    currentMilestone?: string;
    badges: string[];
    workshop: Workshop;
    tasks: WorkshopTask[];
};
