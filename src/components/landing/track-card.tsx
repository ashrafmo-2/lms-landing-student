import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";

interface TrackStat {
  label: string;
  value: string;
}

interface TrackCardProps {
  icon: string;
  gradient: string;
  tag: string;
  title: string;
  description: string;
  includesTitle?: string;
  includes: string[];
  extraIncludes?: string;
  stats: TrackStat[];
  price: string;
  oldPrice?: string;
  priceLabel?: string;
  buttonColor?: string;
  href?: string;
  isSubscribed?: 0 | 1;
}

export function TrackCard({
  icon,
  gradient,
  tag,
  title,
  description,
  includesTitle,
  includes,
  extraIncludes,
  stats,
  price,
  oldPrice,
  priceLabel,
  buttonColor = "hover:bg-[#0067b8]",
  href,
  isSubscribed = 0,
}: TrackCardProps) {
  const t = useTranslations("Tracks");
  const subscribed = isSubscribed === 1;

  const cardClass = `bg-white overflow-hidden border transition-all duration-300 flex flex-col group cursor-pointer h-full ${
    subscribed
      ? "border-[#12b76a]/35 hover:shadow-[0_24px_60px_rgba(18,183,106,0.16)] hover:-translate-y-1"
      : "border-[#d9e3ee] hover:border-[#0067b8]/30 hover:shadow-[0_24px_60px_rgba(16,24,39,0.12)] hover:-translate-y-1"
  }`;

  const content = (
    <>
      <div
        className={`relative flex h-44 flex-col justify-between overflow-hidden bg-linear-to-br ${gradient} px-6 py-5`}
      >
        <i
          className={`${icon} absolute -left-6 -bottom-6 text-[140px] text-white/10 transition-transform duration-500 group-hover:scale-110`}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-white/40" />

        <div className="flex items-center justify-between">
          <span className="border border-white/20 bg-white/14 px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-white backdrop-blur-sm">
            {tag}
          </span>
          {subscribed && (
            <span className="flex items-center gap-1 bg-[#12b76a] px-2.5 py-1 text-[10px] font-black text-white shadow-md">
              <CheckCircle2 className="w-3 h-3" />
              {t("alreadySubscribed")}
            </span>
          )}
        </div>

        <h3 className="relative z-10 max-w-[92%] text-2xl font-black leading-tight text-white">
          {title}
        </h3>
      </div>

      <div className="flex grow flex-col p-6">
        <p className="mb-5 line-clamp-2 text-sm leading-6 text-[#5d6b7d]">
          {description}
        </p>

        <div className="mb-5">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.08em] text-[#8795a7]">
            {includesTitle || t("includedSubjects")}
          </p>
          <div className="flex flex-wrap gap-2">
            {includes.map((item) => (
              <span
                key={item}
                className="border border-[#d9e3ee] bg-[#f8fbfd] px-2.5 py-1 text-xs font-bold text-[#344054]"
              >
                {item}
              </span>
            ))}
            {extraIncludes && (
              <span className="py-1 text-xs font-bold text-[#8795a7]">
                {extraIncludes}
              </span>
            )}
          </div>
        </div>

        <div className="mb-6 mt-auto grid grid-cols-3 border-y border-[#e2ebf4] text-sm">
          {stats.map((stat, index) => (
            <React.Fragment key={stat.label}>
              <div className="flex flex-col px-2 py-3 text-center">
                <span className="text-lg font-black text-[#101827]">
                  {stat.value}
                </span>
                <span className="text-xs font-bold text-[#627084]">
                  {stat.label}
                </span>
              </div>
              {index < stats.length - 1 && <div className="hidden" />}
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            {oldPrice && (
              <span className="block text-xs font-bold text-[#98a6b7] line-through">
                {oldPrice}
              </span>
            )}
            {priceLabel && (
              <span className="block text-xs font-bold text-[#98a6b7]">
                {priceLabel}
              </span>
            )}
            <div className="text-xl font-black text-[#0067b8]">{price}</div>
          </div>

          {subscribed ? (
            <span className="flex items-center gap-1.5 bg-[#ecfdf3] px-4 py-2.5 text-sm font-black text-[#047857]">
              <CheckCircle2 className="w-4 h-4" />
              {t("alreadySubscribed")}
            </span>
          ) : (
            <button
              type="button"
              className={`group/btn bg-[#101827] px-4 py-2.5 text-sm font-black text-white shadow-md transition-colors ${buttonColor}`}
            >
              <span className="inline-flex items-center gap-2">
                {t("subscribeInTrack")}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 rtl:rotate-[-90deg]" />
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {content}
      </Link>
    );
  }

  return <div className={cardClass}>{content}</div>;
}
