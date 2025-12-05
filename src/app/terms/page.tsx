"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8 font-sans flex justify-center">
      <div className="max-w-2xl w-full">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-8 transition">
          <ArrowLeft className="w-5 h-5" /> Kembali
        </button>
        
        <article className="prose dark:prose-invert lg:prose-xl">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Syarat & Ketentuan</h1>
          
          <p className="text-gray-700 dark:text-gray-300">
            Dengan menggunakan BisikKampus, kamu menyetujui aturan main berikut ini demi kenyamanan bersama.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">1. Etika Posting</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Dilarang Doxing:</strong> Jangan menyebut nama lengkap, alamat, atau data pribadi orang lain tanpa izin.</li>
            <li><strong>No Hate Speech:</strong> Ujaran kebencian, SARA, dan bullying tidak ditoleransi.</li>
            <li><strong>Konten Dewasa:</strong> Dilarang memposting konten pornografi atau gore.</li>
          </ul>

          <h3 className="text-xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">2. Moderasi</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Admin berhak menghapus konten atau memblokir akses pengguna yang melanggar aturan tanpa pemberitahuan sebelumnya.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">3. Tentang admin</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Admin masih belajar guys, walaupun 70%an kode di genearate AI, admin masih paham kok soal etika digital. dan jangan ketawa ya kalo liat inspeknya ada typo atau code yang aneh-aneh, soalnya admin masih belajar soal programming juga hehe.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">4. Untuk pengguna</h3>
          <p className="text-gray-700 dark:text-gray-300">
                Guys jangan aneh aneh ya, kayak ngirim HTML injection atau script jahat gitu, soalnya admin juga manusia biasa yang masih belajar programming, jadi kalo ada celah keamanan tolong jangan di exploit ya, kasian adminnya hehe.
            </p>
        </article>
      </div>
    </div>
  );
}