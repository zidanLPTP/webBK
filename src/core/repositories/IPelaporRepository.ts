import { Pelapor } from "../entities/Pelapor";

export interface IPelaporRepository {
  findByDeviceId(deviceId: string): Promise<Pelapor | null>;
  save(pelapor: Pelapor): Promise<void>;
  getStats(deviceId: string): Promise<{ posts: number; likes: number; joinedAt: string }>;
}