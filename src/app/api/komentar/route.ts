import { NextResponse } from "next/server";
import { PrismaKomentarRepository } from "@/infrastructure/repositories/PrismaKomentarRepository";
import { PrismaPelaporRepository } from "@/infrastructure/repositories/PrismaPelaporRepository";
import { AddKomentarUseCase } from "@/core/usecases/AddKomentarUseCase";
import { getSession } from "@/lib/auth"; // Helper Cek Admin
import { z } from "zod"; // Validator

// Schema Validasi POST
const commentSchema = z.object({
  isi: z.string().min(1, "Komentar wajib diisi").max(500, "Kepanjangan woy!"),
  laporanId: z.string().uuid(),
  parentId: z.string().uuid().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const deviceId = request.headers.get("x-device-id");

    // 1. Cek Device ID
    if (!deviceId) return NextResponse.json({ error: "Identitas tidak ditemukan" }, { status: 401 });

    // 2. Validasi Input (Zod)
    const { isi, laporanId, parentId } = commentSchema.parse(body);

    const komentarRepo = new PrismaKomentarRepository();
    const pelaporRepo = new PrismaPelaporRepository();
    const useCase = new AddKomentarUseCase(komentarRepo, pelaporRepo);

    // 3. Eksekusi Use Case
    await useCase.execute(isi, laporanId, deviceId, parentId ?? undefined);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const laporanId = searchParams.get("laporanId");

  if (!laporanId) return NextResponse.json({ success: false, data: [] });

  const repo = new PrismaKomentarRepository();
  const data = await repo.getByLaporanId(laporanId);

  return NextResponse.json({ success: true, data });
}

// DELETE: Hapus Komentar (SECURE VERSION)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const deviceId = request.headers.get("x-device-id"); // ID User Biasa

    if (!id) throw new Error("ID Komentar diperlukan");

    const repo = new PrismaKomentarRepository();
    
    // 1. Cari Komentarnya dulu
    const targetKomentar = await repo.findById(id);
    if (!targetKomentar) {
      return NextResponse.json({ error: "Komentar tidak ditemukan" }, { status: 404 });
    }

    // 2. Cek Authorization: Siapa lu?
    const adminSession = await getSession(); // Cek kalau dia Admin
    const isOwner = (targetKomentar as any).authorDeviceId === deviceId; // Cek kalau dia Pemilik
    const isAdmin = !!adminSession;

    // 3. Gerbang Penjaga
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ 
        success: false, 
        error: "Anda tidak berhak menghapus komentar ini!" 
      }, { status: 403 }); // 403 Forbidden
    }

    // 4. Hapus
    await repo.delete(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}