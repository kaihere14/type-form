import { publicProcedure, router } from "./trpc";
import { z } from "zod";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { workspaceRouter } from "./routes/workspace/route";
import { folderRouter } from "./routes/folder/route";
import { formRouter } from "./routes/form/route";
import { responseRouter } from "./routes/response/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  workspace: workspaceRouter,
  folder: folderRouter,
  form: formRouter,
  response: responseRouter,
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
