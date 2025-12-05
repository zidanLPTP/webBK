"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8 font-sans flex justify-center">
      <div className="max-w-2xl w-full">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-8 transition">
          <ArrowLeft className="w-5 h-5" /> Kembali
        </button>
        
        <article className="prose dark:prose-invert lg:prose-xl">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Kebijakan Privasi</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Terakhir diperbarui: 2025
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            Di BisikKampus, privasi adalah prioritas utama kami. Platform ini dirancang agar kamu bisa bercerita dengan aman tanpa takut identitas aslimu terbongkar.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">Data yang Kami Simpan</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Isi Menfess:</strong> Teks dan gambar yang kamu unggah.</li>
            <li><strong>ID Perangkat (Guest ID):</strong> Kode acak yang tersimpan di browsermu untuk mencegah spamming dan menghitung statistik pribadi. Kami TIDAK menyimpan nama, email, atau nomor HP.</li>
            <li><strong>Log Aktivitas:</strong> Data teknis anonim untuk perbaikan sistem.</li>
          </ul>

          <h3 className="text-xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">Keamanan</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Kami menggunakan enkripsi standar industri. Namun, harap diingat bahwa tidak ada sistem yang 100% aman. Jangan membagikan informasi pribadi yang sensitif (seperti NIK, Alamat Rumah) di dalam konten menfess.
          </p>
        </article>
      </div>
    </div>
  );
}