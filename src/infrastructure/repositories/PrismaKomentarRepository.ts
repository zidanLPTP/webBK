import { IKomentarRepository } from "@/core/repositories/IKomentarRepository";
import { Komentar } from "@/core/entities/Komentar";
import { db } from "../database/db";

export class PrismaKomentarRepository implements IKomentarRepository {
  
  async create(k: Komentar): Promise<void> {
    await db.komentar.create({
      data: {
        id: k.idKomentar,
        isi: k.isiKomentar,
        laporanId: k.laporanId,
        pelaporId: k.pelaporId,
        parentId: k.parentId,
        createdAt: k.tanggal
      }
    });
  }

  async getByLaporanId(laporanId: string): Promise<Komentar[]> {
    const raw = await db.komentar.findMany({
      where: { laporanId: laporanId },
      orderBy: { createdAt: 'asc' },
      include: { pelapor: true }
    });

    return raw.map(r => new Komentar(
      r.id, r.isi, r.createdAt, r.laporanId, r.pelaporId, r.parentId,
      "guest" + r.pelapor.deviceId.substring(0, 3)
    ));
  }

  async delete(id: string): Promise<void> {
    await db.komentar.delete({ where: { id: id } });
  }

  async findById(id: string): Promise<Komentar | null> {
    const data = await db.komentar.findUnique({
      where: { id },
      include: { pelapor: true } 
    });

    if (!data) return null;

    const k = new Komentar(
      data.id, data.isi, data.createdAt, data.laporanId, data.pelaporId, data.parentId
    );
    
    (k as any).authorDeviceId = data.pelapor.deviceId; 
    
    return k;
  }
}