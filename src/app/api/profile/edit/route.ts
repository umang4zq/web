import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession("user");
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url), 303);
  }

  const formData = await req.formData();
  
  await prisma.user.update({
    where: { id: session.id },
    data: {
      name: formData.get("name")?.toString() || undefined,
      phone: formData.get("phone")?.toString() || null,
      address: formData.get("address")?.toString() || null,
      city: formData.get("city")?.toString() || null,
      state: formData.get("state")?.toString() || null,
      pincode: formData.get("pincode")?.toString() || null,
    },
  });

  return NextResponse.redirect(new URL("/profile?success=Profile_updated_successfully", req.url), 303);
}
