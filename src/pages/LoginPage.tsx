import { LoginHero } from "@/modules/login/LoginHero";
import { LoginForm } from "@/modules/login/LoginForm";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-0 lg:grid-cols-2">
        <LoginHero />
        <LoginForm />
      </div>
    </div>
  );
}
