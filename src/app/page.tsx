"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { 
  MessageSquare, Heart, Share2, MapPin, 
  Search, Info, Ghost, BookOpen, AlertTriangle, Smile
} from "lucide-react";


type Postingan = {
  idLaporan: string;
  judul: string;
  isi: string;         
  kategori: string;
  lokasi: string;
  gambar: string | null; 
  waktu: string;
  status: string;
  jumlahLikes: number;
  jumlahKomentar: number;
  pelapor: {
    avatar: string;
  };
};

export default function Home() {
  const [posts, setPosts] = useState<Postingan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterKategori, setFilterKategori] = useState("");


  const fetchPosts = async () => {
    setIsLoading(true);
    try {

      const res = await fetch(`/api/laporan${filterKategori ? `?kategori=${filterKategori}` : ""}`, {
        cache: "no-store", 
      });
      
      const json = await res.json();
      
      if (json.success) {
        setPosts(json.data);
      } else {
        console.error("Gagal ambil data:", json);
      }
    } catch (error) {
      console.error("Error jaringan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filterKategori]);

  const getBadgeColor = (cat: string) => {
    switch(cat) {
      case 'Horor': return 'bg-purple-900 text-purple-200 border-purple-700';
      case 'Info': return 'bg-blue-900 text-blue-200 border-blue-700';
      case 'Percintaan': return 'bg-pink-900 text-pink-200 border-pink-700';
      case 'Humor': return 'bg-yellow-900 text-yellow-200 border-yellow-700';
      default: return 'bg-gray-800 text-gray-200 border-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-gray-200 font-sans">
      
      {/* NAVBAR */}
      <nav className="border-b border-gray-800 bg-[#09090B]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo-kucing.png" width={32} height={32} alt="Logo" /> 
            <span className="font-bold text-xl text-purple-500">BisikKampus</span>
          </div>
          <Link href="/buat" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-bold text-sm transition flex items-center gap-2">
             Buat Menfess
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR KIRI  */}
        <aside className="w-full md:w-64 hidden md:block space-y-2 sticky top-24 h-fit">
           <p className="text-xs font-bold text-gray-500 uppercase px-4 mb-2">Menu Utama</p>
           <button onClick={() => setFilterKategori("")} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 ${filterKategori === "" ? "bg-purple-500/10 text-purple-400" : "hover:bg-gray-800"}`}>
             <Ghost className="w-5 h-5"/> Beranda
           </button>
           <button onClick={() => setFilterKategori("Info")} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-800 text-gray-400">
             <Info className="w-5 h-5"/> Info Kampus
           </button>
           <button onClick={() => setFilterKategori("Horor")} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-800 text-gray-400">
             <AlertTriangle className="w-5 h-5"/> Horor
           </button>
           <button onClick={() => setFilterKategori("Humor")} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-800 text-gray-400">
             <Smile className="w-5 h-5"/> Humor
           </button>
        </aside>

        {/* FEED UTAMA */}
        <main className="flex-1">
          
          {/* Input Pancingan */}
          <div className="bg-[#18181B] border border-gray-800 rounded-2xl p-4 mb-6 flex items-center gap-4 cursor-pointer hover:border-purple-500/50 transition">
             <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-xl">🐱</div>
             <p className="text-gray-500">Kirim menfess rahasia di sini...</p>
          </div>

          {/* LIST POSTINGAN */}
          {isLoading ? (
            <div className="flex justify-center py-20">
               <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
               <Ghost className="w-12 h-12 mx-auto mb-3 opacity-50"/>
               <p>Belum ada menfess, jadilah yang pertama!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.idLaporan} className="bg-[#18181B] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition">
                  
                  {/* Header Post */}
                  <div className="p-4 flex justify-between items-start">
                    <div className="flex gap-3">
                       <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-xl border border-gray-700 shadow-inner">
                         {post.pelapor.avatar}
                       </div>
                       <div>
                         <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-200">Guest-User</h3>
                            <span className="bg-gray-800 text-[10px] px-2 py-0.5 rounded text-gray-400 border border-gray-700">Anon</span>
                         </div>
                         <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <span>{formatDistanceToNow(new Date(post.waktu), { addSuffix: true, locale: idLocale })}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {post.lokasi}</span>
                         </div>
                       </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${getBadgeColor(post.kategori)}`}>
                      {post.kategori.toUpperCase()}
                    </span>
                  </div>

                  {/* Isi Post */}
                  <div className="px-4 pb-2">
                    <h2 className="font-bold text-lg text-white mb-2">{post.judul}</h2>
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
                      {post.isi}
                    </p>
                  </div>

                  {/* Gambar kalo ada sih awkoakow */}
                  {post.gambar && (
                    <div className="mt-3 w-full h-64 relative bg-gray-900">
                      <Image 
                        src={post.gambar} 
                        alt="Post image" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="p-4 border-t border-gray-800 flex items-center justify-between mt-2">
                     <div className="flex gap-6">
                        <button className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition text-sm">
                           <Heart className="w-5 h-5" /> {post.jumlahLikes}
                        </button>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-purple-500 transition text-sm">
                           <MessageSquare className="w-5 h-5" /> {post.jumlahKomentar}
                        </button>
                     </div>
                     <button className="text-gray-400 hover:text-white transition">
                        <Share2 className="w-5 h-5" />
                     </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </main>

        {/* SIDEBAR KANAN */}
        <aside className="w-full md:w-80 hidden lg:block sticky top-24 h-fit">
           <div className="bg-[#18181B] border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">🔥 Lagi Panas</h3>
              <div className="space-y-4">
                 <div className="group cursor-pointer">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                       <span>#1 Trending</span>
                       <span>1 Post</span>
                    </div>
                    <p className="font-bold text-purple-400 group-hover:underline">Curhat</p>
                    <div className="w-full bg-gray-800 h-1 rounded-full mt-2 overflow-hidden">
                       <div className="bg-purple-500 h-full w-3/4"></div>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="mt-6 text-xs text-gray-600 text-center">
              © 2025 BisikKampus • Privacy • Terms
           </div>
        </aside>

      </div>
    </div>
  );
}