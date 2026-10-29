import { z } from "zod";
import { apiFetch } from "@/lib/api";

export const readinessSchema = z.object({
  status: z.enum(["ready", "degraded"]),
  database: z.enum(["ok", "unavailable"]),
  integrations: z.object({
    gemini_text: z.boolean(),
    gemini_image: z.boolean(),
    youtube: z.boolean(),
    email: z.boolean(),
  }),
});
export type Readiness = z.infer<typeof readinessSchema>;

export async function getReadiness(): Promise<Readiness> {
  return readinessSchema.parse(await apiFetch<unknown>("/ready"));
}
