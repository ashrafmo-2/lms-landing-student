"use client";

import {
  CalendarDays,
  CreditCard,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  getMySubscriptions,
  type StudentSubscription,
  type SubscriptionStatus,
} from "@/entities/subscriptions";
import { StudentAuthenticatedGuard } from "@/features/auth/components/student-authenticated-guard";
import { Footer } from "@/widgets/landing-footer";
import { Navbar } from "@/widgets/landing-navbar";

const DEFAULT_STATUS_META = {
  label: "غير معروف",
  className: "bg-gray-50 text-gray-700 border-gray-200",
};

const STATUS_META: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "نشط",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  IN_ACTIVE: {
    label: "غير نشط",
    className: "bg-gray-50 text-gray-700 border-gray-200",
  },
  PENDING: {
    label: "قيد الانتظار",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  EXPIRED: {
    label: "منتهي",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  CANCELLED: {
    label: "ملغي",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

function getStatusMeta(status: SubscriptionStatus | null | undefined) {
  if (!status) return DEFAULT_STATUS_META;

  const normalizedStatus = status.toString().trim().toUpperCase();
  return (
    STATUS_META[normalizedStatus] ?? {
      ...DEFAULT_STATUS_META,
      label: normalizedStatus || DEFAULT_STATUS_META.label,
    }
  );
}

const SKELETON_IDS = [
  "subscription-skeleton-1",
  "subscription-skeleton-2",
  "subscription-skeleton-3",
];

const SKELETON_FIELD_IDS = ["paid", "subject", "start", "end"];

function formatDate(value: string, locale: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatMoney(value: number, locale: string) {
  return `${value.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} ج.م`;
}

function SubscriptionCard({
  subscription,
  locale,
}: {
  subscription: StudentSubscription;
  locale: string;
}) {
  const status = getStatusMeta(subscription.status);

  return (
    <article className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="min-w-0">
          <h2 className="font-extrabold text-gray-900 text-lg truncate">
            {subscription.category.title}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            رقم الاشتراك #{subscription.subscriptionId}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500 mb-1">المدفوع</p>
          <p className="font-extrabold text-[#0067b8]">
            {formatMoney(subscription.paid, locale)}
          </p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500 mb-1">المادة</p>
          <p className="font-bold text-gray-900 truncate">
            {subscription.subject?.title ?? "كل مواد المسار"}
          </p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500 mb-1">تاريخ البداية</p>
          <p className="font-bold text-gray-900">
            {formatDate(subscription.startAt, locale)}
          </p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500 mb-1">تاريخ الانتهاء</p>
          <p className="font-bold text-gray-900">
            {formatDate(subscription.endAt, locale)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
        <CalendarDays className="h-3.5 w-3.5" />
        <span>تم الاشتراك في {formatDate(subscription.startAt, locale)}</span>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        <CalendarDays className="h-3.5 w-3.5" />
        <span>ينتهي الاشتراك في {formatDate(subscription.endAt, locale)}</span>
      </div>
    </article>
  );
}

function LoadingGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SKELETON_IDS.map((id) => (
        <div
          key={id}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 animate-pulse"
        >
          <div className="flex justify-between mb-5">
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
            <div className="h-7 w-16 bg-gray-100 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SKELETON_FIELD_IDS.map((fieldId) => (
              <div key={fieldId} className="h-16 rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SubscriptionsPage() {
  const locale = useLocale();
  const { isAuthenticated, isLoading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<StudentSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const direction = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    let ignore = false;

    if (isLoading || !isAuthenticated) {
      return () => {
        ignore = true;
      };
    }

    setLoading(true);
    getMySubscriptions({ perPage: 100, page: 1 })
      .then((data) => {
        if (!ignore) setSubscriptions(data.subscriptions);
      })
      .catch(() => {
        if (!ignore) setSubscriptions([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, isLoading]);

  const filtered = useMemo(() => {
    const search = searchInput.trim().toLowerCase();
    const fromTime = dateFrom ? new Date(dateFrom).getTime() : null;
    const toTime = dateTo ? new Date(dateTo).getTime() : null;

    return subscriptions.filter((subscription) => {
      const matchesSearch =
        !search || subscription.category.title.toLowerCase().includes(search);
      const startTime = new Date(subscription.startAt).getTime();
      const matchesFrom = fromTime === null || startTime >= fromTime;
      const matchesTo = toTime === null || startTime <= toTime;

      return matchesSearch && matchesFrom && matchesTo;
    });
  }, [dateFrom, dateTo, searchInput, subscriptions]);

  const activeCount = subscriptions.filter(
    (subscription) => subscription.status === "ACTIVE",
  ).length;
  const totalPaid = subscriptions.reduce(
    (sum, subscription) => sum + subscription.paid,
    0,
  );

  return (
    <StudentAuthenticatedGuard>
      <main className="min-h-screen flex flex-col bg-gray-50" dir={direction}>
        <Navbar />

        <div className="grow pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#e8f4ff] flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6 text-[#0067b8]" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                    الاشتراكات
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    تابع حالة اشتراكاتك وتواريخ البداية والانتهاء.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  {
                    label: "كل الاشتراكات",
                    value: subscriptions.length,
                    className: "bg-[#e8f4ff] text-[#0067b8]",
                  },
                  {
                    label: "النشطة",
                    value: activeCount,
                    className: "bg-green-50 text-green-700",
                  },
                  {
                    label: "إجمالي المدفوع",
                    value: formatMoney(totalPaid, locale),
                    className: "bg-blue-50 text-blue-700",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`${item.className} rounded-2xl p-4 text-center`}
                  >
                    <p className="text-xl md:text-2xl font-extrabold">
                      {item.value}
                    </p>
                    <p className="text-xs mt-0.5 opacity-80">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-[1fr_180px_180px] gap-3">
                <div className="relative">
                  <Search className="absolute inset-s-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="ابحث باسم المسار..."
                    className="w-full bg-white border border-gray-200 rounded-2xl py-3 ps-11 pe-10 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0067b8]/40 focus:border-[#0067b8] transition-all"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput("")}
                      className="absolute inset-e-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {loading ? (
              <LoadingGrid />
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <SlidersHorizontal className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-700 font-bold">
                  لا توجد اشتراكات مطابقة
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  جرّب تغيير البحث أو فلترة التاريخ.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((subscription) => (
                  <SubscriptionCard
                    key={subscription.subscriptionId}
                    subscription={subscription}
                    locale={locale}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </StudentAuthenticatedGuard>
  );
}
