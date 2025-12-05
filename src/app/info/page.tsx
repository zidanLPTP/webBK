"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Mail, Globe } from "lucide-react";

export default function InfoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-gray-900 font-sans flex justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        
        {/* Header Image / Pattern */}
        <div className="h-32 bg-gradient-to-r from-[#5D3891] to-purple-500 relative">
          <button 
            onClick={() => router.back()}
            className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 pb-8 -mt-12 relative">
          {/* Logo Kampus Placeholder */}
          <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-2xl shadow-md flex items-center justify-center text-4xl border-4 border-white dark:border-gray-800 mb-4">
            🏛️
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pusat Informasi Kami</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            Selamat datang di papan informasi digital. Di sini kamu bisa menemukan kontak penting dan pengumuman umum terkait kegiatan kampus.
          </p>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 uppercase text-xs tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2 mb-3">
              Kontak yang Bisa Dihubungi
            </h3>

            <div className="grid gap-3">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-white text-sm">Info lomba</p>
                  <a href="https://kseunripedia.my.id/" target="_blank" className="text-xs text-gray-500">https://kseunripedia.my.id/</a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-white text-sm">Terbuka untuk promosi</p>
                  <p className="text-xs text-gray-500">apa yaaa....</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-white text-sm">terbuka jugaa..</p>
                  <p className="text-xs text-gray-500">apa ya...</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/50 rounded-xl">
               <span className="text-xl">💡</span>
               <p className="text-xs text-yellow-800 dark:text-yellow-200 leading-relaxed">
                 Punya info lomba atau event? Kirimkan lewat DM Instagram admin nanti bakal muncul di web kseunripedia.my.id atau gunakan fitur Menfess kategori "Info Kampus".
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}