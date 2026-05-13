import { publicApi, BASE_URL } from "@/shared/api";
import type { ContactPayload, ContactResponse } from "../model";

const publicBase = BASE_URL.replace(/\/student$/, "/public");

export const sendContactMessage = async (payload: ContactPayload): Promise<ContactResponse> => {
    const { data } = await publicApi.post<ContactResponse>(`${publicBase}/contact`, payload);
    return data;
};
