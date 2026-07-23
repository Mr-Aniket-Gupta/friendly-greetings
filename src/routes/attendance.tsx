import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { AttendancePage } from "@/pages/AttendancePage";

export const Route = createFileRoute("/attendance")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Attendance — Workday" },
      { name: "description", content: "Track punches, leaves and monthly attendance calendar." },
      { property: "og:title", content: "Attendance — Workday" },
      { property: "og:description", content: "Monthly calendar, leave balance and today's activity." },
    ],
  }),
  component: () => <RequireAuth><AttendancePage /></RequireAuth>,
});
