import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { CreateLaporanUseCase } from "@/core/usecases/CreateLaporanUseCase";
import { PrismaLaporanRepository } from "@/infrastructure/repositories/PrismaLaporanRepository";
import { PrismaPelaporRepository } from "@/infrastructure/repositories/PrismaPelaporRepository";

const laporanRepo = new PrismaLaporanRepository();
const pelaporRepo = new PrismaPelaporRepository();
const createLaporanUseCase = new CreateLaporanUseCase(laporanRepo, pelaporRepo);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

//  GET
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kategori = searchParams.get("kategori");

  try {
    const statusYangBolehMuncul = ["Aktif", "Ditanggapi", "Selesai"];

    const whereClause: any = {
      status: { in: statusYangBolehMuncul }
    };

    if (kategori) {
      whereClause.kategori = kategori;
    }

    const data = await prisma.laporan.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        pelapor: true,
        komentar: true,
        likes: true
      }
    });

    const formattedData = data.map(item => ({
      idLaporan: item.id,     
      
      judul: item.judul,
      deskripsi: item.deskripsi, 
      kategori: item.kategori,
      lokasi: item.lokasi,
      foto: item.foto,          
      
      tanggal: item.createdAt,   
      status: item.status,      
      
      jumlahLikes: item.likes.length,
      jumlahKomentar: item.komentar.length,
      
      isLikedByMe: false,        
      
      pelapor: {
        id: item.pelapor?.id || "anon",
        avatar: "🐱",          
        role: "Mahasiswa"
      }
    }));

    return NextResponse.json({
      success: true,
      data: formattedData
    });

  } catch (error: any) {
    console.error("Error GET Public:", error);
    return NextResponse.json({ success: false, data: [] });
  }
}

// POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const deviceId = request.headers.get("x-device-id");

    if (!deviceId) return NextResponse.json({ error: "Device ID Missing" }, { status: 400 });

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
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}