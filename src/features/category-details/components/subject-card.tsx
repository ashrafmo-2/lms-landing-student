import { useState } from "react";
import { useTranslations } from "use-intl";

import { Subject } from "@/entities/categories/model";
import { ChevronRight, ClipboardList, GraduationCap, User } from "lucide-react";

const GRADIENTS = [
    "from-blue-600 to-blue-900",
    "from-[#0067b8] to-[#101827]",
    "from-teal-500 to-emerald-800",
    "from-rose-500 to-pink-900",
    "from-orange-500 to-amber-800",
    "from-cyan-500 to-sky-800",
];

const CARD_ACCENT = [
    "text-blue-700",
    "text-[#0067b8]",
    "text-teal-700",
    "text-rose-700",
    "text-orange-700",
    "text-cyan-700",
];

export function SubjectCard({ subject, index, onOpen }: { subject: Subject; index: number; onOpen: () => void }) {
    const tCommon = useTranslations("Common");
    const t = useTranslations("Tracks");
    const gradient = GRADIENTS[index % GRADIENTS.length];
    const accent = CARD_ACCENT[index % CARD_ACCENT.length];
    const hasImage = !!subject.image;
    const [imgError, setImgError] = useState(false);
    const showImage = hasImage && !imgError;

    return (
        <button
            type="button"
            onClick={onOpen}
            className="group w-full text-right rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
        >
            <div className="relative h-36 w-full overflow-hidden shrink-0">
                {showImage ? (
                    <>
                        <img
                            src={subject.image}
                            alt={subject.title}
                            onError={() => setImgError(true)}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                    </>
                ) : (
                    <>
                        <div className={`absolute inset-0 bg-linear-to-br ${gradient}`} />
                        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
                        <div className="absolute -right-2 -top-2 w-16 h-16 rounded-full bg-white/10" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <GraduationCap className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </>
                )}

                <div className="absolute bottom-3 inset-s-3 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white/30 backdrop-blur-sm border border-white/40 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-white text-xs font-medium drop-shadow-sm truncate max-w-32">
                        {subject.teacherName}
                    </span>
                </div>

                {subject.countExams > 0 && (
                    <div className="absolute top-3 inset-e-3 flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        <ClipboardList className="w-3 h-3" />
                        {subject.countExams}
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 p-4 gap-3">
                <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                        {subject.title}
                    </h3>
                    {subject.shortDescription && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            {subject.shortDescription}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <div className="flex flex-col items-center gap-0.5">
                        <span className={`text-base font-extrabold ${accent}`}>{subject.countUnits}</span>
                        <span className="text-[10px] text-gray-400">{tCommon("unit")}</span>
                    </div>
                    <div className="w-px h-7 bg-gray-100" />
                    <div className="flex flex-col items-center gap-0.5">
                        <span className={`text-base font-extrabold ${accent}`}>{subject.countLessons}</span>
                        <span className="text-[10px] text-gray-400">{tCommon("lesson")}</span>
                    </div>
                    <div className="w-px h-7 bg-gray-100" />
                    <div className="flex flex-col items-center gap-0.5">
                        <span className="text-base font-extrabold text-green-600">{subject.countExams}</span>
                        <span className="text-[10px] text-gray-400">{tCommon("exam")}</span>
                    </div>
                </div>

                <div className={`flex items-center justify-center gap-1.5 text-xs font-semibold ${accent} bg-gray-50 group-hover:bg-gray-100 rounded-xl py-2 transition-colors`}>
                    <span>{t("drawer.viewDetails")}</span>
                    <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </div>
            </div>
        </button>
    );
}
