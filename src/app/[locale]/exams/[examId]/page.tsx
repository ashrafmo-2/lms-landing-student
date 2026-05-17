import { ExamDetailPage } from "@/features/exams/components/exam-detail-page";

export default async function ExamPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;

  return <ExamDetailPage examId={examId} backHref="/exams" />;
}