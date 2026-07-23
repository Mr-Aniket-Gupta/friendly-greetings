import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { User, MapPin, Phone, IdCard, GraduationCap, Users as UsersIcon, Landmark, FileText, Pencil, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Field = { key: string; label: string; type?: "text" | "textarea" | "tel"; placeholder?: string };
type Section = { id: string; icon: any; title: string; desc: string; fields: Field[]; initialValues: Record<string, string> };

const SECTIONS: Section[] = [
  {
    id: "about", icon: User, title: "About Me", desc: "Bio & personal summary",
    fields: [{ key: "bio", label: "Bio", type: "textarea", placeholder: "Write a short bio…" }],
    initialValues: { bio: "Passionate product engineer with 3+ years of experience building delightful workplace tools." },
  },
  {
    id: "address", icon: MapPin, title: "Address", desc: "Current & permanent",
    fields: [
      { key: "street", label: "Street / Apartment", placeholder: "A-402, Green Meadows" },
      { key: "city", label: "City", placeholder: "Pune" },
      { key: "state", label: "State", placeholder: "Maharashtra" },
      { key: "pin", label: "PIN Code", placeholder: "411045" },
      { key: "country", label: "Country", placeholder: "India" },
    ],
    initialValues: { street: "A-402, Green Meadows", city: "Pune", state: "Maharashtra", pin: "411045", country: "India" },
  },
  {
    id: "emergency", icon: Phone, title: "Emergency Contact", desc: "Family reachouts",
    fields: [
      { key: "name", label: "Contact Name", placeholder: "Suresh" },
      { key: "relation", label: "Relationship", placeholder: "Father" },
      { key: "phone", label: "Phone", type: "tel", placeholder: "+91 98xxxx1234" },
    ],
    initialValues: { name: "Suresh", relation: "Father", phone: "+91 98xxxx1234" },
  },
  {
    id: "id", icon: IdCard, title: "Identity Proof", desc: "PAN, Aadhaar, Passport",
    fields: [
      { key: "pan", label: "PAN Number", placeholder: "ABCDE1234F" },
      { key: "aadhaar", label: "Aadhaar (last 4)", placeholder: "5678" },
      { key: "passport", label: "Passport Number", placeholder: "Optional" },
    ],
    initialValues: { pan: "ABCDE1234F", aadhaar: "5678", passport: "" },
  },
  {
    id: "edu", icon: GraduationCap, title: "Education", desc: "Degrees & institutions",
    fields: [
      { key: "degree", label: "Degree", placeholder: "B.E. Computer Science" },
      { key: "institution", label: "Institution", placeholder: "Pune University" },
      { key: "year", label: "Graduation Year", placeholder: "2022" },
    ],
    initialValues: { degree: "B.E. Computer Science", institution: "Pune University", year: "2022" },
  },
  {
    id: "family", icon: UsersIcon, title: "Family", desc: "Dependents on record",
    fields: [{ key: "details", label: "Family Details", type: "textarea", placeholder: "List dependents…" }],
    initialValues: { details: "2 dependents listed" },
  },
  {
    id: "bank", icon: Landmark, title: "Bank Details", desc: "Salary account",
    fields: [
      { key: "bank", label: "Bank Name", placeholder: "HDFC Bank" },
      { key: "account", label: "Account (last 4)", placeholder: "4321" },
      { key: "ifsc", label: "IFSC Code", placeholder: "HDFC0000456" },
    ],
    initialValues: { bank: "HDFC Bank", account: "****4321", ifsc: "HDFC0000456" },
  },
  {
    id: "docs", icon: FileText, title: "Documents", desc: "Letters, contracts & policies",
    fields: [], initialValues: {},
  },
];

function SectionContent({ section }: { section: Section }) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(section.initialValues);
  const [draft, setDraft] = useState<Record<string, string>>(section.initialValues);
  const [loading, setLoading] = useState(false);

  if (section.id === "docs") {
    const docs = ["Offer Letter", "Appraisal Letter", "NDA Agreement", "HR Policy", "Tax Declaration", "Salary Slip — Jun 2026"];
    return (
      <div className="pl-12 pb-2">
        <ul className="space-y-2">
          {docs.map((d) => (
            <li key={d} className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
              <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-medium">{d}</span></div>
              <button className="text-xs font-semibold text-teal-600 hover:underline">View</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!editing) {
    return (
      <div className="pl-12 pb-2">
        <div className="rounded-xl bg-accent/50 px-4 py-3 text-sm">
          {Object.entries(values).map(([key, val]) => {
            const field = section.fields.find((f) => f.key === key);
            if (!field) return null;
            return (
              <div key={key} className={Object.keys(values).length > 1 ? "mb-2 last:mb-0" : ""}>
                {Object.keys(values).length > 1 && <span className="text-xs text-muted-foreground">{field.label}: </span>}
                <span>{val || <span className="italic text-muted-foreground">Not set</span>}</span>
              </div>
            );
          })}
        </div>
        <button onClick={() => { setDraft({ ...values }); setEditing(true); }} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700">
          <Pencil className="h-3 w-3" /> Edit
        </button>
      </div>
    );
  }

  async function handleSave() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setValues({ ...draft });
    setLoading(false);
    setEditing(false);
    toast.success(`${section.title} updated successfully`);
  }

  return (
    <div className="pl-12 pb-2 space-y-3">
      {section.fields.map((f) => (
        <div key={f.key}>
          <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">{f.label}</label>
          {f.type === "textarea" ? (
            <textarea value={draft[f.key] ?? ""} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))} rows={3} placeholder={f.placeholder}
              className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          ) : (
            <input type={f.type ?? "text"} value={draft[f.key] ?? ""} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))} placeholder={f.placeholder}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          )}
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <button onClick={() => setEditing(false)} className="inline-flex items-center gap-1.5 rounded-full border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
          <X className="h-3.5 w-3.5" /> Cancel
        </button>
        <button onClick={handleSave} disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
          {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving…</> : <><Save className="h-3.5 w-3.5" />Save</>}
        </button>
      </div>
    </div>
  );
}

export function PersonalInfo() {
  return (
    <div className="rounded-3xl bg-card p-5 lg:col-span-2" style={{ boxShadow: "var(--shadow-card)" }}>
      <h3 className="text-lg font-bold">Personal Information</h3>
      <Accordion type="single" collapsible className="mt-2">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <AccordionItem key={s.id} value={s.id} className="border-b border-border last:border-0">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground"><Icon className="h-4 w-4" /></div>
                  <div>
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent><SectionContent section={s} /></AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
