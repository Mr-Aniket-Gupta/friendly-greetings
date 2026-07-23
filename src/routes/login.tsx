import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/pages/LoginPage";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — Workday" },
      { name: "description", content: "Sign in to your Workday employee dashboard." },
      { property: "og:title", content: "Sign in — Workday" },
      { property: "og:description", content: "Access attendance, leaves and your profile." },
    ],
  }),
  component: LoginPage,
});
