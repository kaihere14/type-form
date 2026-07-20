import jwt from "jsonwebtoken";
import crypto from "crypto";
import {createResfreshTokenAndAccessToken, CreateResfreshTokenAndAccessToken, type  CreateUserInputSchema,createUserInputSchema, type LoginUserInputSchema, loginUserInputSchema, loginWithProviderInputSchema, LoginWithProviderInputSchema, TokenOutputSchema } from "./model";
import { IUser, User } from "@repo/database/models/user-model"
import { env } from "../env";
import { googleOAuth2Client } from "../clients/auth-providers";



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

  private isDuplicateKeyError(err: unknown): boolean {
    return typeof err === "object" && err !== null && "code" in err && (err as { code?: number }).code === 11000;
  }

  private async insertUser(email: string, name: string, password: string, salt: string): Promise<IUser> {
    const existing = await User.findOne({ email });
    if (existing) throw new Error("An account with this email already exists");

    try {
      const user = await User.create({ email, name, password, salt, provider: "credentials" });
      if (!user) throw new Error("Failed to create user");
      return user;
    } catch (err) {
      if (this.isDuplicateKeyError(err)) throw new Error("An account with this email already exists");
      throw err;
    }
  }

  private async googleLogin(): Promise<{ redirect: string }> {
    const authorizeUrl = googleOAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });
    return { redirect: authorizeUrl };
  }

  private async getGoogleUserInfo(code: string): Promise<{ googleId: string; email: string; name?: string }> {
    const { tokens } = await googleOAuth2Client.getToken(code);
    googleOAuth2Client.setCredentials(tokens);

    const { data } = await googleOAuth2Client.request<{
      sub: string;
      email?: string;
      name?: string;
    }>({ url: "https://www.googleapis.com/oauth2/v3/userinfo" });

    if (!data.email) throw new Error("Google account has no email to sign in with");

    return { googleId: data.sub, email: data.email, name: data.name };
  }

  private async findOrCreateGoogleUser(googleId: string, email: string, name?: string): Promise<TokenOutputSchema & { user: ReturnType<UserService["toPublicUser"]> }> {
    let user = await User.findOne({ provider: "google", providerId: googleId });

    if (!user) {
      const existingWithEmail = await User.findOne({ email });
      if (existingWithEmail) {
        throw new Error(`This email is already registered with ${existingWithEmail.provider} sign-in`);
      }

      try {
        user = await User.create({ email, name, provider: "google", providerId: googleId });
        if (!user) throw new Error("Failed to create user");
      } catch (err) {
        if (this.isDuplicateKeyError(err)) throw new Error("This email is already registered with another sign-in method");
        throw err;
      }
    }

    const { accessToken, refreshToken } = await this.generateRefreshTokenAndAccessToken({
      id: user.id as string,
    });

    return { user: this.toPublicUser(user), accessToken, refreshToken };
  }

  private toPublicUser(user: IUser) {
    return {
      id: user.id as string,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  public verifyAccessToken(token: string): { id: string } {
    const payload = jwt.verify(token, env.JWT_TOKEN_SECRET);
    if (typeof payload === "string" || typeof payload.id !== "string") {
      throw new Error("Invalid access token payload");
    }
    return { id: payload.id };
  }

  public async getUserById(id: string) {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    return this.toPublicUser(user);
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

    if (user.provider !== "credentials" || !user.password || !user.salt) {
      throw new Error(`This account uses ${user.provider} sign-in, not a password`);
    }

    const hashedPassword = this.hashedPassword(password, user.salt);
    if (hashedPassword !== user.password) throw new Error("Invalid password");

    const { accessToken, refreshToken } = await this.generateRefreshTokenAndAccessToken({
      id: user.id as string,
    });

    return { user: this.toPublicUser(user), accessToken, refreshToken };
  }

  public async loginWithProvider(input: LoginWithProviderInputSchema) {
    const { provider } = await loginWithProviderInputSchema.parseAsync(input);
    if (provider == "google") {
      return this.googleLogin();
    } else {
      return this.googleLogin();
    }
  }

  public async googleLoginCallback(code: string): Promise<{ redirect: string }> {
    try {
      const { googleId, email, name } = await this.getGoogleUserInfo(code);
      const { user, accessToken, refreshToken } = await this.findOrCreateGoogleUser(googleId, email, name);

      const redirect = new URL("/success", env.FRONTEND_URL);
      redirect.searchParams.set("accessToken", accessToken);
      redirect.searchParams.set("refreshToken", refreshToken);
      redirect.searchParams.set("userId", user.id);

      return { redirect: redirect.toString() };
    } catch (err) {
      const message = err instanceof Error ? err.message : "google_login_failed";
      const redirect = new URL("/login", env.FRONTEND_URL);
      redirect.searchParams.set("error", message);

      return { redirect: redirect.toString() };
    }
  }
}

export default UserService;
