import UserService from "@repo/services/user";
import WorkspaceService from "@repo/services/workspace";
import FolderService from "@repo/services/folder";
import FormService from "@repo/services/form";
import ResponseService from "@repo/services/response";

export const userService = new UserService();
export const workspaceService = new WorkspaceService();
export const folderService = new FolderService();
export const formService = new FormService();
export const responseService = new ResponseService();
