import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { HomePage } from "@/routes/HomePage";
import { HelpPage } from "@/routes/HelpPage";
import { StatusPage } from "@/routes/StatusPage";
import { NotFoundPage } from "@/routes/NotFoundPage";

export const routes = [
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/help", element: <HelpPage /> },
      { path: "/status", element: <StatusPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
export const router = createBrowserRouter(routes);
