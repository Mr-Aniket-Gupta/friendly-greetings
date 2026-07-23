import { AppHeader } from "@/components/AppHeader";
import { ProfileHeader } from "@/modules/profile/ProfileHeader";
import { PersonalInfo } from "@/modules/profile/PersonalInfo";
import { ProfileSidebar } from "@/modules/profile/ProfileSidebar";

export function ProfilePage() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <AppHeader title="My Profile" subtitle="Employee" />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <ProfileHeader />

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <PersonalInfo />
          <ProfileSidebar />
        </section>
      </main>
    </div>
  );
}
