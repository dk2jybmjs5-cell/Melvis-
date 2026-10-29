import { useQuery } from "@tanstack/react-query";
import { getReadiness } from "@/services/system";
import { ApiError } from "@/lib/api";

const LABELS: Record<string, string> = {
  gemini_text: "AI conversations",
  gemini_image: "Visual explanations",
  youtube: "Video library",
  email: "Email (verification and resets)",
};

export function StatusPage() {
  const q = useQuery({ queryKey: ["readiness"], queryFn: getReadiness });

  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-3xl">System status</h1>
      {q.isPending && <p className="mt-6 text-muted" role="status">Checking the API…</p>}
      {q.isError && (
        <div role="alert" className="mt-6 rounded-soft border border-alert/40 p-4">
          <p className="font-bold text-alert">API unreachable</p>
          <p className="mt-1 text-muted">
            {q.error instanceof ApiError ? q.error.message : "Unexpected error."}
          </p>
          <button onClick={() => q.refetch()} className="mt-3 rounded-pill bg-sky px-4 py-2 text-white">
            Check again
          </button>
        </div>
      )}
      {q.data && (
        <dl className="mt-6 divide-y divide-line rounded-soft border border-line bg-surface">
          <Row label="Database" ok={q.data.database === "ok"} />
          {Object.entries(q.data.integrations).map(([k, v]) => (
            <Row key={k} label={LABELS[k] ?? k} ok={v} offText="Not configured" />
          ))}
        </dl>
      )}
    </section>
  );
}

function Row({ label, ok, offText = "Unavailable" }: { label: string; ok: boolean; offText?: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <dt>{label}</dt>
      <dd className={ok ? "text-tide font-bold" : "text-muted"}>{ok ? "Available" : offText}</dd>
    </div>
  );
}
