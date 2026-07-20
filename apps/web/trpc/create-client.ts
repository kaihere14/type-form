import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  return c({
    url: env.NEXT_PUBLIC_API_URL ?? "/trpc",
    fetch(url, options) {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers = new Headers(options?.headers);
      if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

      return fetch(url, {
        ...options,
        headers,
      });
    },
  });
};
