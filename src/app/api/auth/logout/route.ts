import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const type = formData.get("type")?.toString();

  if (type === "admin") {
    await destroySession("admin");
    return NextResponse.redirect(new URL("/admin/login", req.url), 303);
  } else {
    await destroySession("user");
    return NextResponse.redirect(new URL("/", req.url), 303);
  }
}

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");
  
  if (type === "admin") {
    await destroySession("admin");
    return NextResponse.redirect(new URL("/admin/login", req.url), 303);
  } else {
    await destroySession("user");
    return NextResponse.redirect(new URL("/", req.url), 303);
  }
}
