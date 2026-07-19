import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - JAF",
  description: "Your forms and responses on JAF.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
