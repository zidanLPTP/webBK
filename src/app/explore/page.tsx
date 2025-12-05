"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ArrowLeft, X, Loader2 } from "lucide-react";
import SidebarRight from "@/components/SidebarRight";
import MenfessCard from "@/components/MenfessCard";

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Ambil query dari URL (jika ada)
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [laporanList, setLaporanList] = useState<any[]>([]);
  const [trendingList, setTrendingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Kategori Cepat (Quick Access)
  const categories = [
    { label: "👻 Horor", slug: "horor", color: "bg-gray-900 text-white" },
    { label: "💘 Percintaan", slug: "percintaan", color: "bg-pink-100 text-pink-600" },
    { label: "📚 Akademik", slug: "akademik", color: "bg-blue-100 text-blue-600" },
    { label: "🤣 Humor", slug: "humor", color: "bg-yellow-100 text-yellow-700" },
    { label: "📢 Info Kampus", slug: "info", color: "bg-green-100 text-green-700" },
    { label: "💬 Curhat", slug: "curhat", color: "bg-purple-100 text-purple-700" },
  ];

  // Sinkronkan state query jika URL berubah
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Fetch Data Awal
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resFeed, resTrend] = await Promise.all([
          fetch("/api/laporan"),
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
  }, []);

  // Filter Lokal (Client-Side Search)
  const filteredList = laporanList.filter(item => 
    item.deskripsi.toLowerCase().includes(query.toLowerCase()) || 
    item.judul?.toLowerCase().includes(query.toLowerCase())
  );

  // Handle Submit Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query)}`);
    }
  };

  // Handle Clear Search (X Button)
  const clearSearch = () => {
    setQuery("");
    router.push("/explore"); // Reset URL ke awal
  };

  // Handle Like (Optimistic UI)
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
      
      {/* 1. HEADER SEARCH STICKY */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto flex gap-3 items-center">
           
           {/* TOMBOL BACK KE DASHBOARD */}
           <button 
             onClick={() => router.push('/')}
             className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition"
             title="Kembali ke Dashboard"
           >
             <ArrowLeft className="w-5 h-5" />
           </button>

           {/* SEARCH BAR INPUT */}
           <div className="flex-1 relative">
             <form onSubmit={handleSearch}>
               <Search className="absolute left-4 top-3 text-gray-400 w-4 h-4" />
               <input 
                 type="text" 
                 placeholder="Cari topik, jurusan, atau kata kunci..." 
                 className="w-full pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#5D3891] dark:text-white transition"
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
               />
               {/* TOMBOL CLEAR (X) */}
               {query && (
                 <button 
                   type="button"
                   onClick={clearSearch}
                   className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                 >
                   <X className="w-4 h-4" />
                 </button>
               )}
             </form>
           </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 px-4 md:px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* KOLOM TENGAH (Main Content) */}
        <div className="col-span-1 lg:col-span-3 space-y-8">
           
           {/* Kategori Grid (Hanya muncul jika BELUM mencari) */}
           {!query && (
             <div className="animate-in fade-in slide-in-from-bottom-4">
               <h3 className="font-bold text-gray-700 dark:text-white mb-4 px-1">Jelajahi Topik</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                 {categories.map((cat) => (
                   <button 
                     key={cat.slug}
                     onClick={() => router.push(`/kategori/${cat.slug}`)}
                     className={`p-4 rounded-xl text-left font-bold text-sm shadow-sm hover:opacity-90 transition transform hover:scale-[1.02] ${cat.color}`}
                   >
                     {cat.label}
                   </button>
                 ))}
               </div>
             </div>
           )}

           {/* Hasil Pencarian & Feed */}
           <div>
             <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-bold text-gray-700 dark:text-white flex items-center gap-2">
                  {query ? (
                    <>Hasil: <span className="text-[#5D3891]">"{query}"</span></>
                  ) : (
                    "Postingan Terbaru"
                  )}
                </h3>
                {/* INDIKATOR JUMLAH HASIL */}
                {query && (
                  <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md font-medium">
                    {filteredList.length} ditemukan
                  </span>
                )}
             </div>
             
             <div className="space-y-4">
               {loading ? (
                 <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-[#5D3891] animate-spin" /></div>
               ) : filteredList.length === 0 ? (
                 <div className="text-center py-20 text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <div className="text-4xl mb-2">🔍</div>
                    <p>Tidak ditemukan hasil untuk "{query}".</p>
                    <button onClick={clearSearch} className="text-[#5D3891] text-sm font-bold mt-2 hover:underline">
                      Bersihkan pencarian
                    </button>
                 </div>
               ) : (
                 filteredList.map((laporan) => (
                    <MenfessCard key={laporan.idLaporan} data={laporan} onLike={handleLike} />
                 ))
               )}
             </div>
           </div>
        </div>

        {/* KOLOM KANAN (Trending Sidebar) */}
        <div className="hidden lg:block lg:col-span-1">
           <SidebarRight trendingList={trendingList} />
        </div>

      </div>
    </div>
  );
}

// Wrapper Utama dengan Suspense (Wajib di Next.js App Router)
export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Explore...</div>}>
      <ExploreContent />
    </Suspense>
  );
}