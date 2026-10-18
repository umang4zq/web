import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const cwd = process.cwd();
    const tmpExists = fs.existsSync("/tmp/dev.db");
    const count = await prisma.product.count();
    return NextResponse.json({
      status: "ok",
      count,
      cwd,
      tmpExists,
      dbUrl: process.env.DATABASE_URL,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error?.message,
        stack: error?.stack,
        cwd: process.cwd(),
        env: {
          NETLIFY: process.env.NETLIFY,
          DATABASE_URL: process.env.DATABASE_URL,
        },
      },
      { status: 500 }
    );
  }
}
