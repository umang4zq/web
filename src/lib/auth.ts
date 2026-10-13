import * as crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-key-change-in-prod"
);

// Verify legacy Werkzeug password hash
export function verifyPassword(hashString: string, password: string): boolean {
  try {
    if (hashString.startsWith("pbkdf2:sha256:")) {
      const parts = hashString.split("$");
      if (parts.length !== 3) return false;

      const methodParts = parts[0].split(":");
      const iterations = parseInt(methodParts[2], 10);
      const salt = parts[1];
      const storedHash = parts[2];

      const derivedKey = crypto.pbkdf2Sync(
        password,
        salt,
        iterations,
        32,
        "sha256"
      );
      return derivedKey.toString("hex") === storedHash;
    }
    
    // In a real production scenario, we'd handle scrypt here as well if Werkzeug 3.0+ was used
    return false;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}

// Session Management
export async function createSession(userId: number, role: "user" | "admin") {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const token = await new SignJWT({ id: userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(role === "admin" ? "admin_token" : "user_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    path: "/",
  });
}

export async function destroySession(role: "user" | "admin") {
  const cookieStore = await cookies();
  cookieStore.delete(role === "admin" ? "admin_token" : "user_token");
}

export async function getSession(role: "user" | "admin") {
  const cookieStore = await cookies();
  const token = cookieStore.get(role === "admin" ? "admin_token" : "user_token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { id: number; role: "user" | "admin" };
  } catch (error) {
    return null;
  }
}
