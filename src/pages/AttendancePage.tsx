import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AttendanceSummary } from "@/modules/attendance/AttendanceSummary";
import { AttendanceCalendar } from "@/modules/attendance/AttendanceCalendar";
import { AttendanceSidebar } from "@/modules/attendance/AttendanceSidebar";

export function AttendancePage() {
  const today = new Date();
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const monthName = cursor.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const totalDays = new Date(
    cursor.getFullYear(),
    cursor.getMonth() + 1,
    0,
  ).getDate();

  const workingDays = Array.from({ length: totalDays }, (_, i) =>
    new Date(cursor.getFullYear(), cursor.getMonth(), i + 1),
  ).filter((d) => d.getDay() !== 0).length;

  return (
    <div className="min-h-screen bg-background pb-16">
      <AppHeader title={monthName} subtitle="Attendance" />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <AttendanceSummary totalDays={totalDays} workingDays={workingDays} />

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <AttendanceCalendar
            cursor={cursor}
            onCursorChange={setCursor}
            monthName={monthName}
          />
          <AttendanceSidebar />
        </section>
      </main>
    </div>
  );
}
