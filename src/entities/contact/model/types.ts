export type ContactPayload = {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
};

export type ContactResponse = {
    success: boolean;
    message: string;
    data: unknown[];
};
