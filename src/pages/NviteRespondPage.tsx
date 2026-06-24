import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type InviteDetails = {
  subject?: string;
  message?: string;
  questions?: { question: string; type: string; options?: string[] }[];
  responded?: boolean;
  job_title?: string;
  company_name?: string;
};

export default function NviteRespondPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<InviteDetails | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    supabase.functions
      .invoke(`nvite-response?token=${encodeURIComponent(token)}`, { method: "GET" as never })
      .then(({ data, error }) => {
        if (error) throw error;
        setInvite(data?.invite ?? null);
      })
      .catch((e) => toast.error(e.message || "Invalid or expired link"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || invite?.responded) return;
    setSubmitting(true);
    const payload = (invite?.questions ?? []).map((q, i) => ({
      question: q.question,
      answer: answers[i] ?? "",
    }));
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nvite-response?token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: payload }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");
      toast.success("Response submitted. Thank you!");
      setInvite((prev) => (prev ? { ...prev, responded: true } : prev));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <p className="text-slate-600">Invalid link — missing token.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <p className="text-slate-600">Loading opportunity…</p>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <p className="text-slate-600">This NVite link is invalid or has expired.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>{invite.subject || "Opportunity from TalentHub"}</CardTitle>
          {invite.company_name && (
            <p className="text-sm text-slate-500">{invite.company_name}{invite.job_title ? ` · ${invite.job_title}` : ""}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {invite.message && (
            <div className="prose prose-sm max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: invite.message }} />
          )}
          {invite.responded ? (
            <p className="text-emerald-700 font-medium">You have already responded to this NVite.</p>
          ) : (
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              {(invite.questions ?? []).map((q, i) => (
                <div key={i} className="space-y-2">
                  <Label>{q.question}</Label>
                  {q.type === "mcq" && q.options?.length ? (
                    <select
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                      value={answers[i] ?? ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                      required
                    >
                      <option value="">Select…</option>
                      {q.options.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : q.question.length > 80 ? (
                    <Textarea
                      value={answers[i] ?? ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                      required
                    />
                  ) : (
                    <Input
                      value={answers[i] ?? ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                      required
                    />
                  )}
                </div>
              ))}
              <Button type="submit" className="w-full bg-[#0566CD] hover:bg-[#0066c0]" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit response"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
