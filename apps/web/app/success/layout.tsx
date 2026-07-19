import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signing you in - JAF",
  description: "Completing sign in to JAF.",
};

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
