import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "cfr-super-secret-dev-jwt-key-2026-cfb-ranked-community"
);

const COOKIE_NAME = "cfr_session_token";

export interface UserSession {
  userId: string;
  email: string;
  username: string;
  role: string;
}

export const ADMIN_EMAILS = ["kehlerjacob@gmail.com"];

export function isUserAdmin(email?: string | null, role?: string | null): boolean {
  if (!email && !role) return false;
  if (role === "ADMIN") return true;
  if (email && ADMIN_EMAILS.includes(email.toLowerCase().trim())) return true;
  return false;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createSessionToken(payload: UserSession): Promise<string> {
  const role = isUserAdmin(payload.email, payload.role) ? "ADMIN" : payload.role;
  return new SignJWT({ ...payload, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(
  token: string
): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const email = payload.email as string;
    const role = isUserAdmin(email, payload.role as string) ? "ADMIN" : (payload.role as string);
    return {
      userId: payload.userId as string,
      email,
      username: payload.username as string,
      role,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function removeSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
