import { redirect } from "next/navigation";

export default async function DashboardCoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/courses`);
}
