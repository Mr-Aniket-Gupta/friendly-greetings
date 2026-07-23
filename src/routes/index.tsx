import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { HomePage } from "@/pages/HomePage";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Workday — Employee Dashboard" },
      { name: "description", content: "Track attendance, leaves, growth and daily activity in one place." },
      { property: "og:title", content: "Workday — Employee Dashboard" },
      { property: "og:description", content: "Your daily workspace: punch in/out, quick actions, announcements." },
    ],
  }),
  component: () => <RequireAuth><HomePage /></RequireAuth>,
});
