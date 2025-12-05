"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Loader2, Hash } from "lucide-react";
import MenfessCard from "@/components/MenfessCard";
import SidebarRight from "@/components/SidebarRight";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params); // Unwrapping params di Next.js terbaru
  const router = useRouter();
  const slug = resolvedParams.slug;
  
  const [laporanList, setLaporanList] = useState<any[]>([]);
  const [trendingList, setTrendingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Format Judul Kategori (misal: "horor" -> "Horor")
  const categoryTitle = slug.charAt(0).toUpperCase() + slug.slice(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Panggil API dengan parameter kategori
        const [resFeed, resTrend] = await Promise.all([
          fetch(`/api/laporan?kategori=${slug}`),
          fetch("/api/trending")
        ]);
        
        const jsonFeed = await resFeed.json();
        const jsonTrend = await resTrend.json();

        if (jsonFeed.success) setLaporanList(jsonFeed.data);
        if (jsonTrend.success) setTrendingList(jsonTrend.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // Handle Like (Sama seperti Homepage)
  const handleLike = async (id: string) => {
    const guestId = localStorage.getItem("bisik_guest_id");
    if (!guestId) return;

    setLaporanList(prev => prev.map(post => {
      if (post.idLaporan === id) {
        const liked = post.isLikedByMe;
        return {
          ...post,
          isLikedByMe: !liked,
          jumlahLikes: liked ? post.jumlahLikes - 1 : post.jumlahLikes + 1
        };
      }
      return post;
    }));

    await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-device-id": guestId },
      body: JSON.stringify({ laporanId: id })
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-gray-900 font-sans pb-24">
      {/* Header Sticky */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-4 py-3 flex items-center gap-4 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => router.push('/')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
        <div>
          <h1 className="font-bold text-gray-800 dark:text-white text-lg flex items-center gap-2">
            <Hash className="w-5 h-5 text-[#5D3891]" />
            Topik: {categoryTitle}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 px-4 md:px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* KOLOM KIRI (Kosong atau Navigasi Simpel) */}
        <div className="hidden lg:block lg:col-span-1">
           <button 
             onClick={() => router.push('/')}
             className="w-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:text-[#5D3891] transition flex items-center justify-center gap-2 sticky top-24"
           >
             <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
           </button>
        </div>

        {/* KOLOM TENGAH (Feed) */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
           {loading && (
             <div className="flex justify-center py-20">
               <Loader2 className="w-8 h-8 text-[#5D3891] animate-spin" />
             </div>
           )}

           {!loading && laporanList.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                  <div className="text-4xl mb-4">📭</div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Belum ada postingan</h3>
                  <p className="text-gray-500 mb-6">Jadilah yang pertama menulis di topik {categoryTitle}!</p>
              </div>
           )}

           {laporanList.map((laporan) => (
              <MenfessCard 
                key={laporan.idLaporan} 
                data={laporan} 
                onLike={handleLike} 
              />
           ))}
        </div>

        {/* KOLOM KANAN (Trending) */}
        <div className="hidden lg:block lg:col-span-1 h-fit">
            <SidebarRight trendingList={trendingList} />
        </div>

      </div>
    </div>
  );
}