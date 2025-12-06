"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, MapPin, Send, MessageCircle, 
  Heart, Share2, CornerDownRight, 
  Trash2, Loader2, User 
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type KomentarView = {
  idKomentar: string;
  isiKomentar: string;
  guestName: string;
  tanggal: string;
  parentId: string | null;
  pelaporId: string;
};

export default function DetailLaporanPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [myDeviceId, setMyDeviceId] = useState("");
  const router = useRouter();
  const [laporan, setLaporan] = useState<any>(null);
  const [komentars, setKomentars] = useState<KomentarView[]>([]);
  
  const [inputKomentar, setInputKomentar] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Avatar Gradient Helper (Sama dengan MenfessCard)
  const getGradient = (id: string) => {
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

  useEffect(() => {
    const id = localStorage.getItem("bisik_guest_id");
    if(id) setMyDeviceId(id);

    const adminToken = localStorage.getItem("bisik_admin_token");
    if (adminToken) setIsAdmin(true);

    fetch("/api/laporan")
      .then(res => res.json())
      .then(json => {
        const found = json.data.find((l: any) => l.idLaporan === id);
        setLaporan(found);
      });

    fetchKomentar();
  }, [id]);

  const fetchKomentar = async () => {
    const res = await fetch(`/api/komentar?laporanId=${id}`);
    const json = await res.json();
    if (json.success) setKomentars(json.data);
  };

  const handleKirim = async (parentId: string | null = null) => {
    if (!inputKomentar.trim()) return;
    
    setIsSending(true);
    const guestId = localStorage.getItem("bisik_guest_id");
    
    try {
      await fetch("/api/komentar", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-device-id": guestId || "" },
        body: JSON.stringify({ isi: inputKomentar, laporanId: id, parentId }),
      });

      toast.success("Terkirim!");
      setInputKomentar("");
      setActiveReplyId(null);
      fetchKomentar();
    } catch(e) {
      toast.error("Gagal mengirim komentar.");
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (komentarId: string) => {
    if(!confirm("Hapus komentar ini?")) return;
    
    await fetch(`/api/komentar?id=${komentarId}`, { 
      method: "DELETE",
      headers: { "x-device-id": myDeviceId }
    });
    
    toast.success("Komentar dihapus");
    fetchKomentar();
  };

  const rootComments = komentars.filter(k => k.parentId === null);
  const getReplies = (parentId: string) => komentars.filter(k => k.parentId === parentId);

  if (!laporan) return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-gray-900 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#5D3891] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-gray-900 font-sans pb-32">
      
      {/* 1. HEADER STICKY (Glassmorphism) */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-4 py-3 flex items-center gap-4 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-bold text-gray-900 dark:text-white text-lg">Utas Menfess</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Lihat percakapan lengkap</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto pt-6 px-4">
        
        {/* 2. MAIN POST CARD (Style Konsisten) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors">
           {/* User Info */}
           <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner bg-gradient-to-br ${getGradient(laporan.pelaporId)}`}>
                  <span>🐱</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Guest-{laporan.pelaporId.substring(0,4)}</h3>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1 mt-0.5">
                    <span>{formatDistanceToNow(new Date(laporan.tanggal || new Date()), { addSuffix: true, locale: idLocale })}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                       <MapPin className="w-3 h-3" /> {laporan.lokasi || "Kampus"}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5D3891] bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 rounded-full border border-purple-100 dark:border-purple-800">
                {laporan.kategori}
              </span>
           </div>

           {/* Content */}
           <div className="mb-5 pl-[60px]">
              <p className="text-gray-800 dark:text-gray-200 text-[16px] leading-relaxed whitespace-pre-wrap">
                {laporan.deskripsi}
              </p>
           
              {/* Image */}
              {laporan.foto && (
                <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
                    <img src={laporan.foto} className="w-full h-auto object-cover max-h-[500px]" />
                </div>
              )}
           </div>

           {/* Stats Divider */}
           <div className="pl-[60px]">
             <div className="flex items-center justify-between border-t border-b border-gray-50 dark:border-gray-700 py-3 mb-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex gap-4">
                   <span className="font-bold text-gray-900 dark:text-white">{laporan.jumlahLikes || 0} <span className="font-normal text-gray-500 dark:text-gray-400">Suka</span></span>
                   <span className="font-bold text-gray-900 dark:text-white">{komentars.length} <span className="font-normal text-gray-500 dark:text-gray-400">Komentar</span></span>
                </div>
             </div>

             {/* Actions Buttons */}
             <div className="flex justify-between gap-2 text-gray-500 dark:text-gray-400">
                <button className="flex-1 flex items-center justify-center gap-2 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition p-2 rounded-xl">
                   <Heart className="w-5 h-5" /> <span className="text-sm font-medium">Suka</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 text-[#5D3891] bg-purple-50 dark:bg-purple-900/20 dark:text-purple-300 p-2 rounded-xl transition">
                   <MessageCircle className="w-5 h-5" /> <span className="text-sm font-medium">Komentar</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition p-2 rounded-xl">
                   <Share2 className="w-5 h-5" /> <span className="text-sm font-medium">Bagikan</span>
                </button>
             </div>
           </div>
        </div>

        {/* 3. COMMENTS SECTION */}
        <div className="space-y-6">
           <h3 className="font-bold text-gray-700 dark:text-gray-300 px-2 text-sm uppercase tracking-wider">
             Diskusi ({komentars.length})
           </h3>
           
           {rootComments.length === 0 ? (
             <div className="text-center py-12 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <p>Belum ada komentar.</p>
                <p className="text-sm mt-1">Jadilah yang pertama meramaikan!</p>
             </div>
           ) : (
             rootComments.map((induk) => (
                <div key={induk.idKomentar} className="animate-in fade-in slide-in-from-bottom-2">
                   {/* Induk Comment */}
                   <div className="flex gap-3">
                      <div className={`w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br ${getGradient(induk.pelaporId)} shadow-sm`}>
                         {induk.guestName.slice(-2)}
                      </div>
                      <div className="flex-1">
                         <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm relative group">
                            <div className="flex justify-between items-start mb-1">
                               <span className="text-sm font-bold text-gray-900 dark:text-white">
                                 {induk.guestName}
                               </span>
                               <span className="text-[10px] text-gray-400">
                                 {formatDistanceToNow(new Date(induk.tanggal), { locale: idLocale })}
                               </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                              {induk.isiKomentar}
                            </p>
                            
                            {isAdmin && (
                              <button onClick={() => handleDelete(induk.idKomentar)} className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-sm text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                         </div>
                         
                         <div className="flex gap-4 mt-1 ml-2">
                           <button 
                             onClick={() => setActiveReplyId(induk.idKomentar)} 
                             className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-[#5D3891] dark:hover:text-purple-400 transition"
                           >
                             Balas
                           </button>
                         </div>

                         {/* Reply Input Form */}
                         {activeReplyId === induk.idKomentar && (
                            <div className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-2">
                               <input 
                                 autoFocus
                                 className="flex-1 bg-white dark:bg-gray-800 border border-purple-200 dark:border-gray-600 rounded-full px-4 py-2 text-sm outline-none focus:border-[#5D3891] focus:ring-1 focus:ring-[#5D3891] dark:text-white transition"
                                 placeholder={`Balas ${induk.guestName}...`}
                                 value={inputKomentar}
                                 onChange={(e) => setInputKomentar(e.target.value)}
                               />
                               <button onClick={() => handleKirim(induk.idKomentar)} disabled={isSending} className="bg-[#5D3891] text-white p-2 rounded-full hover:bg-[#4a2c75] transition shadow-md">
                                  <Send className="w-4 h-4" />
                               </button>
                            </div>
                         )}

                         {/* Replies List */}
                         {getReplies(induk.idKomentar).length > 0 && (
                           <div className="mt-3 space-y-3">
                              {getReplies(induk.idKomentar).map((anak) => (
                                 <div key={anak.idKomentar} className="flex gap-2 relative pl-4">
                                    {/* Garis Konektor */}
                                    <div className="absolute left-0 top-0 bottom-4 w-4 border-l-2 border-b-2 border-gray-200 dark:border-gray-700 rounded-bl-xl pointer-events-none"></div>
                                    
                                    <div className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-white text-[10px] font-bold bg-gradient-to-br ${getGradient(anak.pelaporId)} mt-2`}>
                                      {anak.guestName.slice(-2)}
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl rounded-tl-none w-full border border-gray-100 dark:border-gray-700/50 group">
                                       <div className="flex justify-between">
                                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{anak.guestName}</span>
                                          {isAdmin && (
                                            <button onClick={() => handleDelete(anak.idKomentar)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 className="w-3 h-3" /></button>
                                          )}
                                       </div>
                                       <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{anak.isiKomentar}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                         )}
                      </div>
                   </div>
                </div>
             ))
           )}
        </div>

      </div>

      {/* 4. FOOTER INPUT FIXED (Theme Aware) */}
      {!activeReplyId && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 p-4 z-50">
           <div className="max-w-2xl mx-auto flex gap-3 items-center">
              <div className="flex-1 relative group">
                 <input 
                   type="text" 
                   className="w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D3891]/50 border border-transparent focus:border-[#5D3891] transition-all placeholder-gray-400"
                   placeholder="Tulis komentar..."
                   value={inputKomentar}
                   onChange={(e) => setInputKomentar(e.target.value)}
                 />
                 <button 
                   onClick={() => handleKirim(null)}
                   disabled={isSending || !inputKomentar.trim()}
                   className="absolute right-2 top-2.5 p-1.5 bg-[#5D3891] rounded-full text-white hover:bg-[#4a2c75] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition shadow-md"
                 >
                   <Send className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}