import { privateApi } from "@/shared/api";
import type {
  ExamAttemptResponse,
  ExamDetailResponse,
  ExamsResponse,
  StartExamResponse,
  SubmitExamAnswerPayload,
  SubmitExamResponse,
} from "../model";

export type GetExamsParams = {
  perPage?: number;
  page?: number;
};

export const getExams = async (
  params: GetExamsParams = {},
): Promise<ExamsResponse["data"]> => {
  const { perPage = 20, page = 1 } = params;
  const { data } = await privateApi.get<ExamsResponse>("/exams", {
    params: { perPage, page },
  });

  return data.data;
};

export const getExamById = async (
  examId: number | string,
): Promise<ExamDetailResponse["data"]> => {
  const { data } = await privateApi.get<ExamDetailResponse>(`/exams/${examId}`);

  return data.data;
};

export const startExam = async (
  examId: number | string,
): Promise<StartExamResponse["data"]> => {
  const { data } = await privateApi.post<StartExamResponse>("/exams/start", {
    examId: Number(examId),
  });

  return data.data;
};

export const submitExamAttempt = async (
  attemptId: number | string,
  answers: SubmitExamAnswerPayload[],
): Promise<SubmitExamResponse["data"]> => {
  const { data } = await privateApi.post<SubmitExamResponse>(
    `/exams/attempts/${attemptId}/submit`,
    { answers },
  );

  return data.data;
};

export const getExamAttempt = async (
  attemptId: number | string,
): Promise<ExamAttemptResponse["data"]> => {
  const { data } = await privateApi.get<ExamAttemptResponse>(
    `/exams/attempts/${attemptId}`,
  );

  return data.data;
};

export const examsQueryKeys = {
  all: ["exams"] as const,
  list: (params?: GetExamsParams) => ["exams", "list", params] as const,
  detail: (examId: number | string) => ["exams", "detail", examId] as const,
  attempt: (attemptId: number | string) =>
    ["exams", "attempt", attemptId] as const,
};
