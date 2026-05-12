import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { TrackCard } from "@/components/landing/track-card";

export default function TracksPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-grow pt-24 pb-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-bold mb-3">
                            اشتراك شامل
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            كل المسارات والباقات التعليمية
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            اختر المسار الذي يناسب مستواك الدراسي واكتشف تجربة تعليمية فريدة تغطي
                            كافة احتياجاتك.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <TrackCard
                            icon="ph-duotone ph-stack"
                            gradient="from-primary-600 to-primary-900"
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

                        {/* Additional Tracks could be added here */}
                        <TrackCard
                            icon="ph-duotone ph-book-open"
                            gradient="from-orange-500 to-red-700"
                            tag="باقة العلوم"
                            title="مسار العلوم المتكامل للمرحلة الإعدادية"
                            description="رحلة تعليمية ممتعة في عالم الفيزياء والكيمياء والأحياء مخصصة لطلاب المرحلة الإعدادية."
                            includes={["فيزياء أساسية", "كيمياء للمبتدئين", "بيولوجيا"]}
                            stats={[
                                { label: "مواد", value: "3" },
                                { label: "فصل", value: "18" },
                                { label: "تجربة", value: "45" },
                            ]}
                            price="450 ج.م"
                            buttonColor="hover:bg-orange-600"
                        />

                        <TrackCard
                            icon="ph-duotone ph-code"
                            gradient="from-blue-600 to-cyan-900"
                            tag="برمجة الويب"
                            title="مسار مطور الويب الشامل (Full Stack)"
                            description="تعلم بناء المواقع من الصفر وحتى الاحتراف باستخدام أحدث التقنيات React و Node.js."
                            includes={["Frontend", "Backend", "Deployment"]}
                            stats={[
                                { label: "تقنية", value: "12" },
                                { label: "مشروع", value: "8" },
                                { label: "ساعة", value: "100+" },
                            ]}
                            price="2500 ج.م"
                            oldPrice="3500 ج.م"
                            buttonColor="hover:bg-blue-600"
                        />

                        <TrackCard
                            icon="ph-duotone ph-palette"
                            gradient="from-pink-500 to-rose-800"
                            tag="تصميم جرافيك"
                            title="باقة مبدع الجرافيك والتعامل مع الأدوات"
                            description="أتقن فن التصميم الرقمي باستخدام Photoshop و Illustrator و Figma لتبدأ رحلتك في التصميم."
                            includes={["Photoshop", "Illustrator", "Figma"]}
                            stats={[
                                { label: "أداة", value: "5" },
                                { label: "تصميم", value: "30" },
                                { label: "فيديو", value: "60" },
                            ]}
                            price="1200 ج.م"
                            buttonColor="hover:bg-pink-600"
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
