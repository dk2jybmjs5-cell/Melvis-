import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { makeQueryClient } from "@/app/providers";
import { StatusPage } from "@/routes/StatusPage";

function renderPage() {
  const qc = makeQueryClient();
  qc.setDefaultOptions({ queries: { retry: false } });
  return render(
    <QueryClientProvider client={qc}><MemoryRouter><StatusPage /></MemoryRouter></QueryClientProvider>,
  );
}

const ready = {
  status: "ready", database: "ok",
  integrations: { gemini_text: false, gemini_image: false, youtube: true, email: false },
};

it("shows real integration availability from the API", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(ready), { status: 200 }));
  renderPage();
  expect(await screen.findByText("Video library")).toBeInTheDocument();
  expect(screen.getAllByText("Not configured")).toHaveLength(3);
});

it("shows a recoverable error when the API is down", async () => {
  const spy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("down"));
  renderPage();
  expect(await screen.findByRole("alert")).toHaveTextContent("API unreachable");
  spy.mockResolvedValue(new Response(JSON.stringify(ready), { status: 200 }));
  await userEvent.click(screen.getByRole("button", { name: "Check again" }));
  expect(await screen.findByText("Database")).toBeInTheDocument();
});
