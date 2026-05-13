import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

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
    buttonColor = "hover:bg-primary-600",
    href,
}: TrackCardProps) {
    const t = useTranslations("Tracks");
    const Wrapper = href ? Link : "div";

    return (
        <Wrapper
            {...(href ? { href } : {})}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
        >
            <div
                className={`h-40 bg-linear-to-br ${gradient} relative overflow-hidden flex flex-col justify-center px-6`}
            >
                <i
                    className={`${icon} absolute -left-6 -bottom-6 text-[140px] text-white/10 group-hover:scale-110 transition-transform duration-500`}
                ></i>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-3 backdrop-blur-sm">
                    {tag}
                </span>
                <h3 className="text-2xl font-bold text-white relative z-10 leading-tight">
                    {title}
                </h3>
            </div>
            <div className="p-6 grow flex flex-col">
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{description}</p>

                <div className="mb-5">
                    <p className="text-xs font-bold text-gray-400 mb-2">{includesTitle || t("includedSubjects")}</p>
                    <div className="flex flex-wrap gap-2">
                        {includes.map((item) => (
                            <span
                                key={item}
                                className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-medium"
                            >
                                {item}
                            </span>
                        ))}
                        {extraIncludes && (
                            <span className="text-gray-400 text-xs py-1">{extraIncludes}</span>
                        )}
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm mb-6">
                    {stats.map((stat, index) => (
                        <React.Fragment key={stat.label}>
                            <div className="flex flex-col text-center">
                                <span className="font-bold text-gray-900 text-lg">
                                    {stat.value}
                                </span>
                                <span className="text-gray-500 text-xs">{stat.label}</span>
                            </div>
                            {index < stats.length - 1 && (
                                <div className="w-px h-8 bg-gray-200"></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        {oldPrice && (
                            <span className="text-xs text-gray-400 block line-through">
                                {oldPrice}
                            </span>
                        )}
                        {priceLabel && (
                            <span className="text-xs text-gray-400 block">{priceLabel}</span>
                        )}
                        <div className="text-xl font-extrabold text-primary-600">{price}</div>
                    </div>
                    <button
                        type="button"
                        className={`bg-gray-900 text-white ${buttonColor} px-5 py-2.5 rounded-xl font-bold transition-colors text-sm shadow-md`}
                    >
                        {t("subscribeInTrack")}
                    </button>
                </div>
            </div>
        </Wrapper>
    );
}
