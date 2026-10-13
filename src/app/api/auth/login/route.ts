import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const next = formData.get("next")?.toString() || "/";
  const type = formData.get("type")?.toString(); // "admin" or undefined

  if (!email || !password) {
    return NextResponse.redirect(new URL("/login?error=Missing credentials", req.url), 303);
  }

  if (type === "admin") {
    const admin = await prisma.admin.findUnique({
      where: { username: email }, // Admin uses username field for login
    });

    if (!admin || !verifyPassword(admin.password, password)) {
      return NextResponse.redirect(new URL("/admin/login?error=Invalid credentials", req.url), 303);
    }

    await createSession(admin.id, "admin");
    return NextResponse.redirect(new URL("/admin", req.url), 303);
  } else {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !verifyPassword(user.password, password)) {
      return NextResponse.redirect(new URL("/login?error=Invalid credentials", req.url), 303);
    }

    await createSession(user.id, "user");
    return NextResponse.redirect(new URL(next, req.url), 303);
  }
}
