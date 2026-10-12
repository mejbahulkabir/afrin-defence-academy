import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Card, CardBody } from "../_components/ui/card";

export default function Dashboard() {
  
  const tiles = [
    { label: "Courses", value: 10, to: "/courses" },
    { label: "Defence Exams", value: 3, to: "/exams" },
    { label: "Faculty", value: 5, to: "/faculty" },
    { label: "Testimonials", value: 44, to: "/testimonials" },
    { label: "Blog Posts", value: 22, to: "/blog" },
    { label: "Contact Inbox", value: 2, to: "/submissions/contact" },
    { label: "Applications", value: 12, to: "/submissions/admission" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Manage all dynamic content for afrindefenceacademy.in.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} href={t.to}>
            <Card className="transition hover:border-slate-300 hover:shadow">
              <CardBody>
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.label}</div>
                <div className="mt-1 text-3xl font-semibold text-slate-900">{t.value ?? "—"}</div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardBody>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Recent contact messages</h2>
              <Link href="/submissions/contact" className="text-xs text-slate-600 hover:text-slate-900">View all →</Link>
            </div>
            <ul className="space-y-2">
              {/* {(contacts.data ?? []).slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium text-slate-900">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.subject ?? "—"} · {formatDate(s.createdAt)}</div>
                  </div>
                  {s.handled ? <span className="text-xs text-emerald-700">Handled</span> : <span className="text-xs text-amber-600">New</span>}
                </li>
              ))}
              {!contacts.data?.length ? <li className="text-sm text-slate-500">No messages yet.</li> : null} */}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Recent applications</h2>
              <Link href="/submissions/admission" className="text-xs text-slate-600 hover:text-slate-900">View all →</Link>
            </div>
            <ul className="space-y-2">
              {/* {(admissions.data ?? []).slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium text-slate-900">{s.fullName}</div>
                    <div className="text-xs text-slate-500">{s.applicationId} · {formatDate(s.createdAt)}</div>
                  </div>
                  {s.handled ? <span className="text-xs text-emerald-700">Handled</span> : <span className="text-xs text-amber-600">New</span>}
                </li>
              ))}
              {!admissions.data?.length ? <li className="text-sm text-slate-500">No applications yet.</li> : null} */}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}