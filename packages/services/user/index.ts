
import crypto from "crypto";
import {type  CreateUserInputSchema,createUserInputSchema, type LoginUserInputSchema, loginUserInputSchema } from "./model";
import {IUser, User} from "@repo/database/models/user-model"

class UserService {
  private hashedPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  }
  private async insertUser(email: string, name: string, password: string, salt: string): Promise<IUser> {
    const user = await User.create({ email, name, password, salt });
    if(!user) throw new Error("Failed to create user");
    return user;
  }
  public async createUser(input: CreateUserInputSchema) {
    const { email, name, password } = await createUserInputSchema.parseAsync(input);
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = this.hashedPassword(password, salt);

    const user = await this.insertUser(email, name, hashedPassword, salt);
    return user.id;
  }

  public async loginUser(input: LoginUserInputSchema) {
    const { email, password } = await loginUserInputSchema.parseAsync(input);
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    const hashedPassword = this.hashedPassword(password, user.salt);
    if (hashedPassword !== user.password) throw new Error("Invalid password");
    return user.id;
  }
}

export default UserService;
