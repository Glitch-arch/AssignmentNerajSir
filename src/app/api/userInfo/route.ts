import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// API for Admin Section to show the collected User info
export async function GET() {
  const userInfo = await prisma.userInfo.findMany().catch((error) => {
    throw error;
  });
  return NextResponse.json(
    {
      data: userInfo,
    },
    { status: 200 }
  );
}
