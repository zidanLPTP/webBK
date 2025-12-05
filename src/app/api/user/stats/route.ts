import { NextResponse } from "next/server";
import { PrismaPelaporRepository } from "@/infrastructure/repositories/PrismaPelaporRepository";

export async function GET(request: Request) {
  const deviceId = request.headers.get("x-device-id");

  if (!deviceId) {
    return NextResponse.json({ posts: 0, likes: 0 });
  }

  const repo = new PrismaPelaporRepository();
  const stats = await repo.getStats(deviceId);

  return NextResponse.json({ success: true, data: stats });
}