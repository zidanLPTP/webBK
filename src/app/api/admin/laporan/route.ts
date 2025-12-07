import { NextResponse } from "next/server";
import { PrismaLaporanRepository } from "@/infrastructure/repositories/PrismaLaporanRepository";
import { StatusLaporan } from "@/core/entities/Laporan";
import { getSession } from "@/lib/auth"; // Import Session Checker
import { z } from "zod";

export const dynamic = 'force-dynamic';
export const revalidate = 0

// Schema Validasi PATCH
const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['Pending', 'Ditanggapi', 'Selesai', 'Ditolak']),
});

// Middleware-like function untuk cek admin
async function checkAdmin() {
  const session = await getSession();
  if (!session || session.role !== "superadmin") { // Sesuaikan role di DB
    return false;
  }
  return true;
}

export async function GET(request: Request) {
  // 1. CEK TOKEN/COOKIE
  if (!await checkAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as StatusLaporan;

  // Validasi Query Param sederhana
  const validStatuses = ['Pending', 'Ditanggapi', 'Selesai', 'Ditolak'];
  if (!status || !validStatuses.includes(status)) {
    return NextResponse.json({ success: false, error: "Status invalid" }, { status: 400 });
  }

  const repo = new PrismaLaporanRepository();
  const data = await repo.getByStatus(status);

  return NextResponse.json({ success: true, data });
}

export async function PATCH(request: Request) {
  // 1. CEK TOKEN
  if (!await checkAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // 2. VALIDASI INPUT (ZOD) - Fix saranmu
    const { id, status } = patchSchema.parse(body);

    const repo = new PrismaLaporanRepository();
    await repo.updateStatus(id, status as StatusLaporan);

    // TODO: Tambahkan Audit Log disini (misal: Admin X mengubah Laporan Y jadi Z)
    console.log(`AUDIT: Admin changed Report ${id} to ${status}`);

    return NextResponse.json({ success: true, message: "Status berhasil diubah" });
  } catch (error: any) {
    // 3. SECURE ERROR HANDLING
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}