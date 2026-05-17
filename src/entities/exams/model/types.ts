export type ExamLevel = "subject" | "unit" | "subUnit";

export type ExamRef = {
  title: string;
};

export type ExamCategoryRef = ExamRef & {
  categoryId: number;
};

export type ExamSubjectRef = ExamRef & {
  subjectId: number;
};

export type ExamUnitRef = ExamRef & {
  unitId: number;
};

export type ExamSubUnitRef = ExamRef & {
  subUnitId: number;
};

export type ExamAttemptSummary = {
  attemptId: number;
  score: number;
  totalScore: number;
  percentage: number;
  isCompleted: 0 | 1;
  startedAt?: string;
  submittedAt: string | null;
};

export type ExamListItem = {
  examId: number;
  title: string;
  description: string;
  durationInMinutes: number;
  totalMarks: number;
  isLimited: boolean;
  showResult: boolean;
  level: ExamLevel;
  category: ExamCategoryRef;
  subject: ExamSubjectRef | null;
  unit: ExamUnitRef | null;
  subUnit: ExamSubUnitRef | null;
  isCompleted: 0 | 1;
  lastAttempt: ExamAttemptSummary | null;
};

export type ExamsPagination = {
  total: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
};

export type ExamsResponse = {
  success: boolean;
  message: string;
  data: {
    totalExams: number;
    completedExams: number;
    exams: ExamListItem[];
    pagination: ExamsPagination;
  };
};

export type ExamDetail = Omit<ExamListItem, "lastAttempt"> & {
  questionsCount: number;
  canStart: boolean;
  myBestScore: number | null;
  rank: number | null;
  totalParticipants: number;
  attempts: ExamAttemptSummary[];
};

export type ExamDetailResponse = {
  success: boolean;
  message: string;
  data: ExamDetail;
};

export type ExamAnswerChoice = {
  answerId: number;
  answerText: string;
  explanation: string | null;
  attachment: string | null;
};

export type ExamQuestion = {
  questionId: number;
  questionText: string;
  grade: number;
  order: number;
  isMultiAnswer: boolean;
  attachment: string | null;
  answers: ExamAnswerChoice[];
};

export type StartedExamAttempt = {
  attemptId: number;
  examId: number;
  title: string;
  durationInMinutes: number;
  totalMarks: number;
  startedAt: string;
  questions: ExamQuestion[];
};

export type StartExamResponse = {
  success: boolean;
  message: string;
  data: StartedExamAttempt;
};

export type SubmitExamAnswerPayload = {
  questionId: number;
  answerIds: number[];
};

export type CorrectAnswer = {
  answerId: number;
  answerText: string;
  explanation?: string | null;
  attachment?: string | null;
};

export type SubmittedAnswerResult = {
  questionId: number;
  answerId: number;
  answerText?: string;
  explanation?: string | null;
  attachment?: string | null;
  isCorrect: boolean;
  gradeEarned: number;
  correctAnswer: CorrectAnswer | null;
};

export type SubmitExamResult = {
  attemptId: number;
  score: number;
  totalScore: number;
  percentage: number;
  showResult: boolean;
  submittedAt: string;
  answers: SubmittedAnswerResult[];
};

export type SubmitExamResponse = {
  success: boolean;
  message: string;
  data: SubmitExamResult;
};

export type AttemptAnswerResult = SubmittedAnswerResult & {
  questionText: string;
  answerText: string;
};

export type ExamAttemptResult = {
  attemptId: number;
  examId: number;
  examTitle: string;
  score: number;
  totalScore: number;
  percentage: number;
  showResult: boolean;
  startedAt: string;
  submittedAt: string;
  answers: AttemptAnswerResult[];
};

export type ExamAttemptResponse = {
  success: boolean;
  message: string;
  data: ExamAttemptResult;
};
