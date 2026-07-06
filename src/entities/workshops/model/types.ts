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
    submissionType: "link" | "github" | "file" | "text" | "quiz" | "checklist";
    status?: string;
    attachments?: WorkshopFile[];
    rubric?: string[];
    checklist?: string[];
    feedback?: string;
    score?: number;
};

export type WorkshopFile = {
    name?: string;
    url?: string;
    path?: string;
    size?: number;
    mimeType?: string;
};

export type WorkshopSubmission = {
    submissionId: number;
    workshopId?: number;
    taskId: number;
    taskTitle?: string;
    studentId?: number;
    studentName?: string;
    status: "not_submitted" | "submitted" | "late" | "under_review" | "needs_changes" | "approved" | "rejected";
    submissionUrl?: string;
    textAnswer?: string;
    files?: WorkshopFile[];
    quizAnswers?: unknown[];
    checklistAnswers?: unknown[];
    feedback?: string;
    score?: number;
    submittedAt?: string;
    reviewedAt?: string;
    reviewerName?: string;
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

export type PaymentRequestStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PaymentMethod = "Vodafone Cash" | "InstaPay" | "Bank Transfer";

export type PaymentRequest = {
    paymentRequestId: number;
    studentId: number;
    studentName?: string;
    studentEmail?: string;
    workshopId: number;
    workshopTitle?: string;
    amount: number;
    paymentMethod: PaymentMethod;
    senderPhone: string;
    senderName?: string | null;
    transactionRef?: string | null;
    receiptUrl?: string;
    status: PaymentRequestStatus;
    rejectionReason?: string | null;
    reviewedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type PaymentDetails = {
    vodafoneCashNumber: string;
    instapayAccount: string;
    bankAccountDetails: string;
};

export type WorkshopPaymentStatus = {
    workshop: Workshop;
    amount: number;
    paymentDetails: PaymentDetails;
    isEnrolled: boolean;
    paymentRequest: PaymentRequest | null;
};
