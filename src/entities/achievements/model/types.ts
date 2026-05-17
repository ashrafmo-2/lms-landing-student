export type TopCategoryAchievement = {
  categoryId: number;
  title: string;
  watchedLessons: number;
  totalLessons: number;
  completionPercentage: number;
  rank: number;
  totalStudents: number;
};

export type BestExamAchievement = {
  examId: number;
  title: string;
  score: number;
  totalScore: number;
  percentage: number;
  submittedAt: string;
  rank: number;
  totalParticipants: number;
};

export type AchievementsData = {
  topCategory: TopCategoryAchievement | null;
  bestExam: BestExamAchievement | null;
};

export type AchievementsResponse = {
  success: boolean;
  message: string;
  data: AchievementsData;
};
