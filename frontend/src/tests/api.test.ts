import { apiFetch, ApiError } from "@/lib/api";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("apiFetch", () => {
  it("returns parsed JSON and sends cookies", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(json(200, { status: "ok" }));
    await expect(apiFetch("/health")).resolves.toEqual({ status: "ok" });
    expect(spy.mock.calls[0]?.[1]).toMatchObject({ credentials: "include" });
  });

  it("maps the backend error shape to ApiError", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      json(404, { error: { code: "http_error", message: "Not Found", request_id: "r1" } }),
    );
    await expect(apiFetch("/x")).rejects.toMatchObject({ status: 404, code: "http_error", requestId: "r1" });
  });

  it("reports network failures without leaking internals", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));
    const err = (await apiFetch("/x").catch((e: unknown) => e)) as ApiError;
    expect(err).toBeInstanceOf(ApiError);
    expect(err.code).toBe("network_error");
    expect(err.message).not.toMatch(/TypeError/);
  });
});
