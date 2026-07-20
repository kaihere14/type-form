import type { Metadata } from "next";

import { DashboardShell } from "~/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Dashboard - JAF",
  description: "Your forms and responses on JAF.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
