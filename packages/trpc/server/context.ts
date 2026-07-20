import type { IncomingMessage, ServerResponse } from "http";

// Typed on the plain Node http types so both the tRPC express adapter and
// trpc-to-openapi's middleware can share this createContext.
export async function createContext({ req, res }: { req: IncomingMessage; res: ServerResponse }) {
  return { req, res };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
