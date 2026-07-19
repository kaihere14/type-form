import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up - JAF",
  description: "Create your JAF account - Just another form.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
