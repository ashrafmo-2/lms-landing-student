"use client";

import { StatusPill } from "@/components/workshops/workshop-ui";
import { getStudentTask, submitStudentTask } from "@/entities/workshops/api";
import type { WorkshopTask } from "@/entities/workshops/api";
import { UploadCloud } from "lucide-react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardTaskPage() {
    const { taskId } = useParams<{ taskId: string }>();
    const locale = useLocale();
    const isAr = locale === "ar";
    const [task, setTask] = useState<WorkshopTask | null>(null);
    const [answer, setAnswer] = useState("");
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (taskId) getStudentTask(taskId).then(({ task }) => setTask(task));
    }, [taskId]);

    async function submit() {
        if (!taskId) return;
        setSaving(true);
        try {
            await submitStudentTask(taskId, task?.submissionType === "link" ? { submissionUrl: answer } : { textAnswer: answer });
            setDone(true);
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
                <p className="mt-4 text-sm font-bold text-muted-foreground">{isAr ? "Deadline:" : "Deadline:"} {task.deadline ? new Date(task.deadline).toLocaleString() : "-"}</p>
            </div>

            <section className="rounded-3xl bg-card p-6 shadow-sm">
                <h2 className="text-2xl font-black">{isAr ? "تفاصيل التسليم" : "Submission"}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{task.instructions ?? task.description}</p>
                <div className="mt-5">
                    <label className="text-sm font-bold">
                        {task.submissionType === "link" ? (isAr ? "رابط التسليم" : "Submission link") : (isAr ? "الإجابة النصية" : "Text answer")}
                    </label>
                    <textarea
                        value={answer}
                        onChange={(event) => setAnswer(event.target.value)}
                        rows={6}
                        className="mt-2 w-full rounded-2xl border border-border bg-background p-4 outline-none focus:border-[#6c3aff]"
                    />
                </div>
                {done && <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{isAr ? "تم تسليم التاسك بنجاح." : "Task submitted successfully."}</p>}
                <button type="button" onClick={submit} disabled={saving} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6c3aff] px-6 py-3 text-sm font-black text-white disabled:opacity-60">
                    <UploadCloud className="h-4 w-4" />
                    {saving ? (isAr ? "جاري التسليم..." : "Submitting...") : (isAr ? "تسليم التاسك" : "Submit task")}
                </button>
            </section>

            {task.feedback && (
                <section className="rounded-3xl bg-card p-6 shadow-sm">
                    <h2 className="text-2xl font-black">{isAr ? "Feedback المدرب" : "Instructor feedback"}</h2>
                    <p className="mt-2 text-muted-foreground">{task.feedback}</p>
                    <p className="mt-3 text-sm font-bold">{isAr ? "Score:" : "Score:"} {task.score ?? "-"}</p>
                </section>
            )}
        </div>
    );
}
