export type ContactPayload = {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    source?: string;
    workshopId?: number;
    metadata?: Record<string, unknown>;
};

export type ContactResponse = {
    success: boolean;
    message: string;
    data: unknown;
};
