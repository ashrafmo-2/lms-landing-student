"use client";

import { StatusPill } from "@/components/workshops/workshop-ui";
import { getStudentTask, submitStudentTask } from "@/entities/workshops/api";
import type { WorkshopSubmission, WorkshopTask } from "@/entities/workshops/api";
import { CheckCircle2, ExternalLink, FileArchive, GitBranch, LinkIcon, MessageSquareText, UploadCloud, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState, type Dispatch, type ElementType, type ReactNode, type SetStateAction } from "react";

export default function DashboardTaskPage() {
    const { taskId } = useParams<{ taskId: string }>();
    const locale = useLocale();
    const isAr = locale === "ar";
    const [task, setTask] = useState<WorkshopTask | null>(null);
    const [submission, setSubmission] = useState<WorkshopSubmission | null>(null);
    const [submissionUrl, setSubmissionUrl] = useState("");
    const [textAnswer, setTextAnswer] = useState("");
    const [checklistAnswers, setChecklistAnswers] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!taskId) return;

        getStudentTask(taskId).then(({ task, submission }) => {
            setTask(task);
            setSubmission(submission ?? null);
            setSubmissionUrl(submission?.submissionUrl ?? "");
            setTextAnswer(submission?.textAnswer ?? "");
            setChecklistAnswers((submission?.checklistAnswers as string[] | undefined) ?? []);
        });
    }, [taskId]);

    async function submit() {
        if (!taskId) return;
        setError("");
        setSaving(true);
        try {
            const payload = new FormData();

            if (submissionUrl.trim()) payload.append("submissionUrl", submissionUrl.trim());
            if (textAnswer.trim()) payload.append("textAnswer", textAnswer.trim());
            checklistAnswers.forEach((item) => payload.append("checklistAnswers[]", item));
            files.forEach((file) => payload.append("files[]", file));

            const { data } = await submitStudentTask(taskId, payload);
            setSubmission(data.data ?? null);
            setDone(true);
        } catch {
            setError(isAr ? "تعذر تسليم المهمة. راجع البيانات وحاول مرة أخرى." : "Could not submit the task. Check your inputs and try again.");
        } finally {
            setSaving(false);
        }
    }

    if (!task) return <div className="w-full rounded-2xl bg-card p-8 text-center">{isAr ? "جاري التحميل..." : "Loading..."}</div>;

    return (
        <div className="w-full space-y-6" dir={isAr ? "rtl" : "ltr"}>
            <div className="rounded-3xl bg-card p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                    <StatusPill status={task.status} />
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">{task.submissionType}</span>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">{task.difficulty}</span>
                </div>
                <h1 className="mt-4 text-3xl font-black">{task.title}</h1>
                <p className="mt-2 max-w-3xl text-muted-foreground">{task.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold text-muted-foreground">
                    <span>{isAr ? "الموعد النهائي:" : "Deadline:"} {task.deadline ? new Date(task.deadline).toLocaleString() : "-"}</span>
                    <span>•</span>
                    <span>{isAr ? "النقاط:" : "Points:"} {task.points ?? 0}</span>
                    {task.estimatedTime && (
                        <>
                            <span>•</span>
                            <span>{task.estimatedTime}</span>
                        </>
                    )}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <section className="rounded-3xl bg-card p-6 shadow-sm">
                    <h2 className="text-2xl font-black">{isAr ? "تفاصيل التسليم" : "Submission details"}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{task.instructions ?? task.description}</p>

                    <TaskLists task={task} isAr={isAr} checklistAnswers={checklistAnswers} setChecklistAnswers={setChecklistAnswers} />

                    <div className="mt-6 space-y-5">
                        {["link", "github", "file"].includes(task.submissionType) && (
                            <Field label={task.submissionType === "github" ? (isAr ? "رابط GitHub" : "GitHub link") : (isAr ? "رابط التسليم" : "Submission link")} icon={task.submissionType === "github" ? GitBranch : LinkIcon}>
                                <input
                                    type="url"
                                    value={submissionUrl}
                                    onChange={(event) => setSubmissionUrl(event.target.value)}
                                    placeholder={task.submissionType === "github" ? "https://github.com/user/repo" : "https://..."}
                                    className="w-full rounded-2xl border border-border bg-background p-4 outline-none focus:border-[#6c3aff]"
                                />
                            </Field>
                        )}

                        {["text", "link", "github", "file", "checklist"].includes(task.submissionType) && (
                            <Field label={isAr ? "ملاحظاتك" : "Your notes"} icon={MessageSquareText}>
                                <textarea
                                    value={textAnswer}
                                    onChange={(event) => setTextAnswer(event.target.value)}
                                    rows={5}
                                    placeholder={isAr ? "اكتب شرح مختصر للتسليم أو أي ملاحظات للمدرب" : "Add a short explanation or notes for the instructor"}
                                    className="w-full rounded-2xl border border-border bg-background p-4 outline-none focus:border-[#6c3aff]"
                                />
                            </Field>
                        )}

                        {["file", "github", "link"].includes(task.submissionType) && (
                            <Field label={isAr ? "رفع ملفات" : "Upload files"} icon={FileArchive}>
                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background p-6 text-center transition hover:border-[#6c3aff]">
                                    <UploadCloud className="h-8 w-8 text-[#6c3aff]" />
                                    <span className="mt-2 text-sm font-bold">{isAr ? "اختر ملف أو أكثر" : "Choose one or more files"}</span>
                                    <span className="mt-1 text-xs text-muted-foreground">{isAr ? "ZIP, PDF, صور، أو ملفات المشروع" : "ZIP, PDF, images, or project files"}</span>
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
                                    />
                                </label>
                                {files.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {files.map((file) => (
                                            <span key={`${file.name}-${file.size}`} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-bold">
                                                {file.name}
                                                <button type="button" onClick={() => setFiles((current) => current.filter((item) => item !== file))}>
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </Field>
                        )}
                    </div>

                    {done && <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{isAr ? "تم تسليم التاسك بنجاح." : "Task submitted successfully."}</p>}
                    {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}

                    <button type="button" onClick={submit} disabled={saving} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6c3aff] px-6 py-3 text-sm font-black text-white disabled:opacity-60">
                        <UploadCloud className="h-4 w-4" />
                        {saving ? (isAr ? "جاري التسليم..." : "Submitting...") : (isAr ? "تسليم التاسك" : "Submit task")}
                    </button>
                </section>

                <aside className="space-y-6">
                    <SubmissionStatus submission={submission} task={task} isAr={isAr} />
                    {task.attachments?.length ? (
                        <section className="rounded-3xl bg-card p-6 shadow-sm">
                            <h2 className="text-xl font-black">{isAr ? "مرفقات المهمة" : "Task attachments"}</h2>
                            <div className="mt-4 space-y-2">
                                {task.attachments.map((file, index) => (
                                    <a key={`${file.url ?? file.path ?? index}`} href={file.url ?? file.path} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-border p-3 text-sm font-bold hover:border-[#6c3aff]">
                                        <span>{file.name ?? `${isAr ? "ملف" : "File"} ${index + 1}`}</span>
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                ))}
                            </div>
                        </section>
                    ) : null}
                </aside>
            </div>
        </div>
    );
}

function Field({ label, icon: Icon, children }: { label: string; icon: ElementType; children: ReactNode }) {
    return (
        <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold">
                <Icon className="h-4 w-4 text-[#6c3aff]" />
                {label}
            </label>
            {children}
        </div>
    );
}

function TaskLists({ task, isAr, checklistAnswers, setChecklistAnswers }: { task: WorkshopTask; isAr: boolean; checklistAnswers: string[]; setChecklistAnswers: Dispatch<SetStateAction<string[]>> }) {
    const toggleChecklist = (item: string) => {
        setChecklistAnswers((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
    };

    if (!task.rubric?.length && !task.checklist?.length) return null;

    return (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
            {task.rubric?.length ? (
                <div className="rounded-2xl border border-border bg-background p-4">
                    <h3 className="font-black">{isAr ? "معايير التقييم" : "Rubric"}</h3>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {task.rubric.map((item) => <li key={item}>• {item}</li>)}
                    </ul>
                </div>
            ) : null}

            {task.checklist?.length ? (
                <div className="rounded-2xl border border-border bg-background p-4">
                    <h3 className="font-black">{isAr ? "قائمة التحقق" : "Checklist"}</h3>
                    <div className="mt-3 space-y-2">
                        {task.checklist.map((item) => (
                            <label key={item} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                                <input type="checkbox" checked={checklistAnswers.includes(item)} onChange={() => toggleChecklist(item)} />
                                <span>{item}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function SubmissionStatus({ submission, task, isAr }: { submission: WorkshopSubmission | null; task: WorkshopTask; isAr: boolean }) {
    const feedback = submission?.feedback ?? task.feedback;
    const score = submission?.score ?? task.score;

    return (
        <section className="rounded-3xl bg-card p-6 shadow-sm">
            <h2 className="text-xl font-black">{isAr ? "حالة التسليم" : "Submission status"}</h2>
            <div className="mt-3">
                <StatusPill status={submission?.status ?? task.status ?? "not_submitted"} />
            </div>

            {submission?.submittedAt && <p className="mt-3 text-sm text-muted-foreground">{isAr ? "تم التسليم:" : "Submitted:"} {new Date(submission.submittedAt).toLocaleString()}</p>}

            {submission?.submissionUrl && (
                <a href={submission.submissionUrl} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-between rounded-2xl border border-border p-3 text-sm font-bold text-[#6c3aff]">
                    <span>{submission.submissionUrl}</span>
                    <ExternalLink className="h-4 w-4" />
                </a>
            )}

            {submission?.files?.length ? (
                <div className="mt-4 space-y-2">
                    {submission.files.map((file, index) => (
                        <a key={`${file.url ?? file.path ?? index}`} href={file.url ?? file.path} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-border p-3 text-sm font-bold">
                            <span>{file.name ?? `${isAr ? "ملف" : "File"} ${index + 1}`}</span>
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    ))}
                </div>
            ) : null}

            {feedback && (
                <div className="mt-5 rounded-2xl bg-background p-4">
                    <div className="flex items-center gap-2 font-black">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        {isAr ? "مراجعة المدرب" : "Instructor review"}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{feedback}</p>
                    <p className="mt-3 text-sm font-bold">{isAr ? "الدرجة:" : "Score:"} {score ?? "-"}</p>
                </div>
            )}
        </section>
    );
}
