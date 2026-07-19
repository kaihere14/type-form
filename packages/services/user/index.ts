import jwt from "jsonwebtoken";
import crypto from "crypto";
import {createResfreshTokenAndAccessToken, CreateResfreshTokenAndAccessToken, type  CreateUserInputSchema,createUserInputSchema, type LoginUserInputSchema, loginUserInputSchema, TokenOutputSchema } from "./model";
import { IUser, User } from "@repo/database/models/user-model"
import { env } from "../env";


class UserService {
  private async generateRefreshTokenAndAccessToken(input: CreateResfreshTokenAndAccessToken): Promise<TokenOutputSchema> {
    const { id } = await createResfreshTokenAndAccessToken.parseAsync(input);
    const accessToken = jwt.sign({ id }, env.JWT_TOKEN_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id }, env.JWT_TOKEN_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
  }
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
    return user.id as string;
  }
  public async loginUser(input: LoginUserInputSchema) {
    const { email, password } = await loginUserInputSchema.parseAsync(input);

    const user = await User.findOne({ email }); // fetch password + salt, need them below
    if (!user) throw new Error("User not found");

    const hashedPassword = this.hashedPassword(password, user.salt);
    if (hashedPassword !== user.password) throw new Error("Invalid password");

    const { accessToken, refreshToken } = await this.generateRefreshTokenAndAccessToken({
      id: user.id as string,
    });

    // strip sensitive fields before returning
    const publicUser = {
      id: user.id as string,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { user: publicUser, accessToken, refreshToken };
  }
}

export default UserService;
