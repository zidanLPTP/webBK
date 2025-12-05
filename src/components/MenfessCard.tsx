"use client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { MessageCircle, Heart, Share2, MoreHorizontal, MapPin } from "lucide-react";

type Props = {
  data: any;
  onLike: (id: string) => void;
};

export default function MenfessCard({ data, onLike }: Props) {
  // Generate Avatar Gradient berdasarkan ID Pelapor
  const getGradient = (id: string) => {
    // Fallback jika id undefined/null
    if (!id) return "from-gray-400 to-gray-500";
    
    const colors = [
      "from-pink-500 to-rose-500",
      "from-purple-500 to-indigo-500",
      "from-blue-400 to-cyan-500",
      "from-green-400 to-emerald-500",
      "from-orange-400 to-amber-500",
    ];
    const index = id.charCodeAt(id.length - 1) % colors.length;
    return colors[index];
  };

  // Helper untuk format tanggal aman
  const formatDate = (dateString: string) => {
    try {
        if (!dateString) return "Baru saja";
        return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: idLocale });
    } catch (e) {
        return "Baru saja";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-start mb-3">
        {/* Avatar & Identitas */}
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner bg-gradient-to-br ${getGradient(data.pelaporId)}`}>
            {/* Maskot Kecil */}
            <span className="text-lg">🐱</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                Guest-{data.pelaporId ? data.pelaporId.substring(0, 4) : "???"}
              </h3>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-md font-medium border border-gray-200 dark:border-gray-600">
                Anon
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-400 mt-0.5 gap-1">
              {/* PERBAIKAN DI SINI: Gunakan data.tanggal */}
              <span>{formatDate(data.tanggal)}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-gray-500">
                 <MapPin className="w-3 h-3" /> {data.lokasi || "Kampus"}
              </span>
            </div>
          </div>
        </div>

        {/* Menu & Badge Kategori */}
        <div className="flex flex-col items-end gap-1">
           <button className="text-gray-300 hover:text-gray-600 dark:hover:text-gray-200">
             <MoreHorizontal className="w-5 h-5" />
           </button>
           <span className="text-[10px] font-bold uppercase tracking-wider text-[#5D3891] bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-full">
             {data.kategori}
           </span>
        </div>
      </div>

      {/* Konten Text */}
      <Link href={`/laporan/${data.idLaporan}`}>
        <div className="pl-[56px] mb-3">
          <p className="text-gray-800 dark:text-gray-200 text-[15px] leading-relaxed whitespace-pre-wrap">
            {data.deskripsi}
          </p>
        </div>

        {/* Konten Gambar */}
        {data.foto && (
           <div className="pl-[56px] mb-4">
             <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm relative">
                <img src={data.foto} alt="Lampiran" className="w-full h-auto max-h-[500px] object-cover" />
             </div>
           </div>
        )}
      </Link>

      {/* Tombol Interaksi */}
      <div className="pl-[56px] flex items-center justify-between border-t border-gray-50 dark:border-gray-700 pt-3 mt-2">
        <div className="flex gap-6">
           {/* Tombol Like */}
           <button 
             onClick={() => onLike(data.idLaporan)}
             className={`flex items-center gap-2 group/btn transition ${data.isLikedByMe ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'}`}
           >
             <div className={`p-2 rounded-full group-hover/btn:bg-pink-50 dark:group-hover/btn:bg-pink-900/20 transition ${data.isLikedByMe ? 'bg-pink-50 dark:bg-pink-900/20' : ''}`}>
               <Heart className={`w-5 h-5 ${data.isLikedByMe ? 'fill-pink-500' : ''}`} />
             </div>
             <span className="text-sm font-semibold">{data.jumlahLikes || 0}</span>
           </button>

           {/* Tombol Komentar */}
           <Link href={`/laporan/${data.idLaporan}`} className="flex items-center gap-2 text-gray-500 hover:text-[#5D3891] dark:hover:text-purple-400 group/btn transition">
             <div className="p-2 rounded-full group-hover/btn:bg-purple-50 dark:group-hover/btn:bg-purple-900/20 transition">
               <MessageCircle className="w-5 h-5" />
             </div>
             <span className="text-sm font-semibold">{data.jumlahKomentar || 0}</span>
           </Link>
        </div>

        <button className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">
           <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}