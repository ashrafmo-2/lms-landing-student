import Link from "next/link";
import { TrackCard } from "./track-card";

export function CoursesSection() {
    return (
        <section id="modules" className="py-20 bg-gray-50" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div>
                        <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-bold mb-3">اشتراك شامل</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">المسارات والباقات التعليمية</h2>
                        <p className="text-gray-600">اشترك في المسار المناسب لك، وافتح كل المواد والفصول التابعة له بضغطة واحدة.</p>
                    </div>
                    <Link
                        href="/tracks"
                        className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 px-6 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2 shadow-sm shrink-0"
                    >
                        عرض الكل
                        <i className="ph-bold ph-arrow-left"></i>
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TrackCard
                        icon="ph-duotone ph-stack"
                        gradient="from-blue-600 to-blue-900"
                        tag="مسار متكامل"
                        title="باقة الصف الثالث الثانوي (علمي رياضة)"
                        description="مسار شامل يغطي جميع مقررات شعبة الرياضيات بأحدث طرق الشرح والامتحانات التفاعلية."
                        includes={["تفاضل وتكامل", "جبر هندسة فراغية", "فيزياء"]}
                        extraIncludes="+3 مواد أخرى"
                        stats={[
                            { label: "مواد", value: "6" },
                            { label: "فصل", value: "42" },
                            { label: "فيديو ومرفق", value: "150+" },
                        ]}
                        price="850 ج.م"
                        oldPrice="1200 ج.م"
                    />

                    <TrackCard
                        icon="ph-duotone ph-student"
                        gradient="from-purple-600 to-indigo-900"
                        tag="مسار تأسيس"
                        title="مسار التأسيس البرمجي للطلاب الجدد"
                        description="باقة مخصصة لتعلم أساسيات البرمجة وعلوم الحاسب من الصفر وحتى مستوى متقدم."
                        includes={["مقدمة الخوارزميات", "بايثون (Python)", "قواعد البيانات"]}
                        stats={[
                            { label: "مواد", value: "3" },
                            { label: "فصل", value: "15" },
                            { label: "درس عملي", value: "80+" },
                        ]}
                        price="600 ج.م"
                        priceLabel="اشتراك مدى الحياة"
                        buttonColor="hover:bg-purple-600"
                    />

                    <TrackCard
                        icon="ph-duotone ph-globe-hemisphere-west"
                        gradient="from-teal-500 to-emerald-800"
                        tag="باقة اللغات"
                        title="مسار إتقان اللغة الإنجليزية الشامل"
                        description="دورة مكثفة تغطي جميع مهارات اللغة الإنجليزية من المحادثة، الاستماع، القراءة، والكتابة."
                        includesTitle="المستويات (المواد):"
                        includes={["المبتدئين A1/A2", "المتوسط B1/B2", "تحضير الايلتس"]}
                        stats={[
                            { label: "مستويات", value: "4" },
                            { label: "وحدة", value: "24" },
                            { label: "اختبار", value: "120" },
                        ]}
                        price="1450 ج.م"
                        oldPrice="2000 ج.م"
                        buttonColor="hover:bg-teal-600"
                    />
                </div>

            </div>
        </section>
    );
}
