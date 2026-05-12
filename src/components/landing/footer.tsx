import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#0f172a] text-white py-12" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-[#6c3aff] flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">إديوستار</span>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed mb-4">
                            منصة تعليمية متكاملة مصممة خصيصاً لتلبية احتياجات الطالب، بنوفرلك أمان، محتوى متاح دائماً، وتجربة تنافسية ممتعة.
                        </p>
                        <div className="flex gap-3">
                            {/* <a
                                href="#"
                                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-4 h-4" />
                            </a> */}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-base mb-4">روابط سريعة</h3>
                        <ul className="space-y-2 text-sm text-white/70">
                            <li>
                                <a href="#hero" className="hover:text-white transition-colors">
                                    الرئيسية
                                </a>
                            </li>
                            <li>
                                <a href="#courses" className="hover:text-white transition-colors">
                                    الكورسات
                                </a>
                            </li>
                            <li>
                                <a href="#features" className="hover:text-white transition-colors">
                                    المميزات
                                </a>
                            </li>
                            <li>
                                <Link href="/auth/login" className="hover:text-white transition-colors">
                                    تواصل معنا
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-bold text-base mb-4">الدعم</h3>
                        <ul className="space-y-2 text-sm text-white/70">
                            <li>
                                <Link href="/auth/login" className="hover:text-white transition-colors">
                                    الأسئلة الشائعة
                                </Link>
                            </li>
                            <li>
                                <Link href="/auth/login" className="hover:text-white transition-colors">
                                    شروط الاستخدام
                                </Link>
                            </li>
                            <li>
                                <Link href="/auth/login" className="hover:text-white transition-colors">
                                    سياسة الخصوصية
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Empty column for spacing */}
                    <div />
                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 pt-6 text-center text-sm text-white/60">
                    جميع الحقوق محفوظة © 2026 منصة إديوستار التعليمية.
                </div>
            </div>
        </footer>
    );
}
