"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { type ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(`/${locale}/`);
    }
  }, [isAuthenticated, isLoading, router, locale]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0067b8]" />
      </div>
    );
  }

  return children;
}
