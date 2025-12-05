import { NextResponse } from "next/server";
import { CreateLaporanUseCase } from "@/core/usecases/CreateLaporanUseCase";
import { GetPublicLaporanUseCase } from "@/core/usecases/GetPublicLaporanUseCase"; // Asumsi ada UseCase ini atau langsung repo
import { PrismaLaporanRepository } from "@/infrastructure/repositories/PrismaLaporanRepository";
import { PrismaPelaporRepository } from "@/infrastructure/repositories/PrismaPelaporRepository";

// Dependency Injection Setup
const laporanRepo = new PrismaLaporanRepository();
const pelaporRepo = new PrismaPelaporRepository();
const createLaporanUseCase = new CreateLaporanUseCase(laporanRepo, pelaporRepo);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const deviceId = request.headers.get("x-device-id");

    if (!deviceId) {
      return NextResponse.json({ error: "Device ID tidak ditemukan" }, { status: 400 });
    }

    const laporanBaru = await createLaporanUseCase.execute({
      judul: body.judul,
      deskripsi: body.deskripsi,
      kategori: body.kategori,
      lokasi: body.lokasi,
      foto: body.foto || null,
      deviceId: deviceId,
    });

    return NextResponse.json({ success: true, data: laporanBaru }, { status: 201 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// UPDATE BAGIAN GET INI:
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kategori = searchParams.get("kategori"); // Ambil param kategori

  let data;
  if (kategori) {
    // Jika ada kategori, filter!
    data = await laporanRepo.getByCategory(kategori);
  } else {
    // Jika tidak ada, ambil semua public
    data = await laporanRepo.getAllPublic();
  }

  return NextResponse.json({
    success: true,
    data: data
  });
}