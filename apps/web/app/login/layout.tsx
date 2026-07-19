import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in - JAF",
  description: "Log in to JAF - Just another form.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
