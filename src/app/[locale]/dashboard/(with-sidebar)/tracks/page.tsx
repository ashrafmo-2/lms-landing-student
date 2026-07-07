import { redirect } from "next/navigation";

export default async function DashboardTracksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/tracks`);
}
