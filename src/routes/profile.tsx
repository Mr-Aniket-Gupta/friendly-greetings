import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { ProfilePage } from "@/pages/ProfilePage";

export const Route = createFileRoute("/profile")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Profile — Workday" },
      { name: "description", content: "Your employee profile, documents, settings and activity." },
      { property: "og:title", content: "Profile — Workday" },
      { property: "og:description", content: "Manage personal info, documents and preferences." },
    ],
  }),
  component: () => <RequireAuth><ProfilePage /></RequireAuth>,
});
