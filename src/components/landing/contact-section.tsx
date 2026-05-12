"use client";

import { Mail, MessageCircle, MapPin, Phone, Send } from "lucide-react";

export function ContactSection() {
	return (
		<section id="contact" className="py-24 bg-white" dir="rtl">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-16 items-start">
					{/* Contact Info */}
					<div>
						<div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-bold mb-3">
							تواصل معنا
						</div>
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
							عندك استفسار؟ احنا هنا عشان نساعدك!
						</h2>
						<p className="text-lg text-gray-600 mb-10">
							سواء كنت طالب محتاج مساعدة، أو ولي أمر عايز يتابع، فريق الدعم
							الفني متواجد دايماً للرد على كل أسئلتكم.
						</p>

						<div className="space-y-8">
							<div className="flex items-start gap-4">
								<div className="w-12 h-12 rounded-2xl bg-[#ede9ff] flex items-center justify-center shrink-0">
									<Phone className="w-6 h-6 text-[#6c3aff]" />
								</div>
								<div>
									<h4 className="font-bold text-[#0f172a] mb-1">اتصل بنا</h4>
									<p className="text-[#64748b]" dir="ltr">
										+20 123 456 7890
									</p>
									<p className="text-[#64748b]" dir="ltr">
										+20 111 222 3333
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="w-12 h-12 rounded-2xl bg-[#ede9ff] flex items-center justify-center shrink-0">
									<Mail className="w-6 h-6 text-[#6c3aff]" />
								</div>
								<div>
									<h4 className="font-bold text-[#0f172a] mb-1">
										البريد الإلكتروني
									</h4>
									<p className="text-[#64748b]">support@edustar.com</p>
									<p className="text-[#64748b]">info@edustar.com</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="w-12 h-12 rounded-2xl bg-[#ede9ff] flex items-center justify-center shrink-0">
									<MapPin className="w-6 h-6 text-[#6c3aff]" />
								</div>
								<div>
									<h4 className="font-bold text-[#0f172a] mb-1">الموقع</h4>
									<p className="text-[#64748b]">القاهرة، المعادي، شارع 9</p>
								</div>
							</div>
						</div>

						<div className="mt-12 p-6 bg-[#f8fafc] rounded-3xl border border-[#e2e8f0] flex items-center gap-4">
							<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
								<MessageCircle className="w-5 h-5 text-green-600" />
							</div>
							<div>
								<p className="text-sm font-bold text-[#0f172a]">
									متاحين واتساب 24/7
								</p>
								<p className="text-xs text-[#64748b]">
									رد سريع خلال أقل من 15 دقيقة
								</p>
							</div>
						</div>
					</div>

					{/* Contact Form */}
					<div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
						{/* Decorative circles */}
						<div className="absolute -top-10 -left-10 w-40 h-40 bg-[#6c3aff]/5 rounded-full blur-3xl" />
						<div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#6c3aff]/5 rounded-full blur-3xl" />

						<form
							className="space-y-5 relative z-10"
							onSubmit={(e) => e.preventDefault()}
						>
							<div className="grid sm:grid-cols-2 gap-5">
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-bold text-[#0f172a] mb-2"
									>
										الاسم بالكامل
									</label>
									<input
										id="name"
										type="text"
										placeholder="مثال: أحمد محمد"
										className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] outline-none focus:border-[#6c3aff] focus:ring-4 focus:ring-[#6c3aff]/10 transition-all text-sm"
									/>
								</div>
								<div>
									<label
										htmlFor="phone"
										className="block text-sm font-bold text-[#0f172a] mb-2"
									>
										رقم الموبايل
									</label>
									<input
										id="phone"
										type="tel"
										placeholder="01xxxxxxxxx"
										className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] outline-none focus:border-[#6c3aff] focus:ring-4 focus:ring-[#6c3aff]/10 transition-all text-sm"
										dir="ltr"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="email"
									className="block text-sm font-bold text-[#0f172a] mb-2"
								>
									البريد الإلكتروني
								</label>
								<input
									id="email"
									type="email"
									placeholder="name@example.com"
									className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] outline-none focus:border-[#6c3aff] focus:ring-4 focus:ring-[#6c3aff]/10 transition-all text-sm"
									dir="ltr"
								/>
							</div>

							<div>
								<label
									htmlFor="subject"
									className="block text-sm font-bold text-[#0f172a] mb-2"
								>
									الموضوع
								</label>
								<select
									id="subject"
									className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] outline-none focus:border-[#6c3aff] focus:ring-4 focus:ring-[#6c3aff]/10 transition-all text-sm appearance-none bg-white"
								>
									<option>استفسار عام</option>
									<option>دعم فني</option>
									<option>شكوى أو اقتراح</option>
									<option>استفسار عن الاشتراكات</option>
								</select>
							</div>

							<div>
								<label
									htmlFor="message"
									className="block text-sm font-bold text-[#0f172a] mb-2"
								>
									رسالتك
								</label>
								<textarea
									id="message"
									rows={4}
									placeholder="اكتب رسالتك هنا بالتفصيل..."
									className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] outline-none focus:border-[#6c3aff] focus:ring-4 focus:ring-[#6c3aff]/10 transition-all text-sm resize-none"
								/>
							</div>

							<button
								type="submit"
								className="w-full bg-[#6c3aff] hover:bg-[#5228e8] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#6c3aff]/20 flex items-center justify-center gap-2 group"
							>
								إرسال الرسالة
								<Send className="w-4 h-4 group-hover:-translate-x-1 group-hover:translate-y-1 transition-transform" />
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
