import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirm_password")?.toString();

  if (!name || !email || !password || password !== confirmPassword) {
    return NextResponse.redirect(
      new URL("/register?error=Invalid details or passwords mismatch", req.url),
      303
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.redirect(
      new URL("/register?error=Email already in use", req.url),
      303
    );
  }

  // Create a Werkzeug-compatible hash for new users to maintain consistency
  const salt = crypto.randomBytes(16).toString("hex").substring(0, 16);
  const iterations = 600000;
  const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256");
  const hashedPassword = `pbkdf2:sha256:${iterations}$${salt}$${derivedKey.toString("hex")}`;

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.redirect(new URL("/login?success=Account created", req.url), 303);
}
