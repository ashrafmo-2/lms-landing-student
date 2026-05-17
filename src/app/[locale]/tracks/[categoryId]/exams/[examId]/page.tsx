import { ExamDetailPage } from "@/features/exams/components/exam-detail-page";

export default async function CategoryExamPage({
  params,
}: {
  params: Promise<{ categoryId: string; examId: string }>;
}) {
  const { categoryId, examId } = await params;

  return <ExamDetailPage examId={examId} backHref={`/tracks/${categoryId}`} />;
}
