import {
  Calendar, Plane, Compass, TrendingUp, Wallet, FileText, Users, Award,
  Clock, HeartHandshake, GraduationCap, Coffee, ClipboardList, BadgeCheck,
} from "lucide-react";
import type { ComponentType } from "react";

export type QuickAction = {
  id: string;
  label: string;
  desc: string;
  tint: string;
  icon: ComponentType<{ className?: string }>;
};

export const ALL_ACTIONS: QuickAction[] = [
  { id: "attendance", label: "Attendance", desc: "Mark & regularize", tint: "bg-sky-100 text-sky-600", icon: Calendar },
  { id: "leave", label: "Leave", desc: "Apply & balance", tint: "bg-violet-100 text-violet-600", icon: Plane },
  { id: "outdoor", label: "Outdoor Duty", desc: "Field visits", tint: "bg-orange-100 text-orange-600", icon: Compass },
  { id: "growth", label: "My Growth", desc: "Goals & reviews", tint: "bg-teal-100 text-teal-600", icon: TrendingUp },
  { id: "payroll", label: "Payroll", desc: "Payslips & tax", tint: "bg-emerald-100 text-emerald-600", icon: Wallet },
  { id: "documents", label: "Documents", desc: "Letters & policies", tint: "bg-rose-100 text-rose-600", icon: FileText },
  { id: "team", label: "Team", desc: "Directory & org", tint: "bg-indigo-100 text-indigo-600", icon: Users },
  { id: "rewards", label: "Rewards", desc: "Points & perks", tint: "bg-amber-100 text-amber-600", icon: Award },
  { id: "shifts", label: "Shifts", desc: "Roster & swaps", tint: "bg-cyan-100 text-cyan-600", icon: Clock },
  { id: "helpdesk", label: "Helpdesk", desc: "Raise a ticket", tint: "bg-fuchsia-100 text-fuchsia-600", icon: HeartHandshake },
  { id: "learning", label: "Learning", desc: "Courses & LMS", tint: "bg-lime-100 text-lime-600", icon: GraduationCap },
  { id: "cafeteria", label: "Cafeteria", desc: "Meals & credits", tint: "bg-yellow-100 text-yellow-600", icon: Coffee },
  { id: "tasks", label: "Tasks", desc: "To-do & assignments", tint: "bg-blue-100 text-blue-600", icon: ClipboardList },
  { id: "approvals", label: "Approvals", desc: "Pending items", tint: "bg-pink-100 text-pink-600", icon: BadgeCheck },
];

export const DEFAULT_IDS = ["attendance", "leave", "outdoor", "growth", "payroll", "documents", "team", "rewards"];