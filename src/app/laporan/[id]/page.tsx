"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, User, MapPin, Send, MessageCircle, 
  Heart, Share2, MoreHorizontal, CornerDownRight, 
  Trash2, Loader2 
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
  
  const router = useRouter();
  const [laporan, setLaporan] = useState<any>(null);
  const [komentars, setKomentars] = useState<KomentarView[]>([]);
  
  const [inputKomentar, setInputKomentar] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Avatar Gradient Helper
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
    const adminToken = localStorage.getItem("bisik_admin_token");
    if (adminToken) setIsAdmin(true);

    // Fetch Detail Laporan (Idealnya endpoint khusus, tapi kita pakai list filter dulu)
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

      toast.success("Komentar terkirim!");
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
    await fetch(`/api/komentar?id=${komentarId}`, { method: "DELETE" });
    toast.success("Komentar dihapus");
    fetchKomentar();
  };

  // Helper render komentar
  const rootComments = komentars.filter(k => k.parentId === null);
  const getReplies = (parentId: string) => komentars.filter(k => k.parentId === parentId);

  if (!laporan) return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#5D3891] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans pb-32">
      
      {/* 1. HEADER STICKY */}
      <div className="bg-white px-4 py-3 flex items-center gap-4 shadow-sm sticky top-0 z-40">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div>
          <h1 className="font-bold text-gray-800 text-lg">Postingan</h1>
          <p className="text-xs text-gray-500">Lihat percakapan</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto pt-6 px-4">
        
        {/* 2. MAIN POST CARD */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
           {/* User Info */}
           <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner bg-gradient-to-br ${getGradient(laporan.pelaporId)}`}>
                  <span>🐱</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Guest-{laporan.pelaporId.substring(0,4)}</h3>
                  <div className="flex items-center text-xs text-gray-500 gap-1 mt-0.5">
                    <span>{formatDistanceToNow(new Date(laporan.tanggal || new Date()), { addSuffix: true, locale: idLocale })}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-gray-500">
                       <MapPin className="w-3 h-3" /> {laporan.lokasi || "Kampus"}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5D3891] bg-purple-50 px-3 py-1 rounded-full">
                {laporan.kategori}
              </span>
           </div>

           {/* Content */}
           <div className="mb-4">
              <p className="text-gray-800 text-[16px] leading-relaxed whitespace-pre-wrap">
                {laporan.deskripsi}
              </p>
           </div>

           {/* Image */}
           {laporan.foto && (
             <div className="mb-5 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <img src={laporan.foto} className="w-full h-auto object-cover" />
             </div>
           )}

           {/* Stats Divider */}
           <div className="flex items-center justify-between border-t border-b border-gray-50 py-3 mb-4 text-sm text-gray-500">
              <div className="flex gap-4">
                 <span className="font-bold text-gray-800">{laporan.jumlahLikes || 0} <span className="font-normal text-gray-500">Suka</span></span>
                 <span className="font-bold text-gray-800">{komentars.length} <span className="font-normal text-gray-500">Komentar</span></span>
              </div>
           </div>

           {/* Actions Buttons */}
           <div className="flex justify-around text-gray-500">
              <button className="flex items-center gap-2 hover:text-pink-500 transition p-2 rounded-lg hover:bg-pink-50">
                 <Heart className="w-5 h-5" /> <span className="text-sm font-medium">Suka</span>
              </button>
              <button className="flex items-center gap-2 text-[#5D3891] bg-purple-50 p-2 rounded-lg transition">
                 <MessageCircle className="w-5 h-5" /> <span className="text-sm font-medium">Komentar</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-500 transition p-2 rounded-lg hover:bg-blue-50">
                 <Share2 className="w-5 h-5" /> <span className="text-sm font-medium">Bagikan</span>
              </button>
           </div>
        </div>

        {/* 3. COMMENTS SECTION */}
        <div className="space-y-4">
           <h3 className="font-bold text-gray-700 px-2">Komentar ({komentars.length})</h3>
           
           {rootComments.length === 0 ? (
             <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                Belum ada komentar. Jadilah yang pertama!
             </div>
           ) : (
             rootComments.map((induk) => (
                <div key={induk.idKomentar} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                   {/* Induk Comment */}
                   <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br ${getGradient(induk.pelaporId)}`}>
                         {induk.guestName.slice(-2)}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start">
                            <div>
                               <span className="text-sm font-bold text-gray-900">{induk.guestName}</span>
                               <span className="text-xs text-gray-400 ml-2">{formatDistanceToNow(new Date(induk.tanggal), { locale: idLocale })}</span>
                            </div>
                            {isAdmin && (
                              <button onClick={() => handleDelete(induk.idKomentar)} className="text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            )}
                         </div>
                         <p className="text-gray-700 text-sm mt-1 leading-relaxed">{induk.isiKomentar}</p>
                         
                         <button 
                           onClick={() => setActiveReplyId(induk.idKomentar)} 
                           className="text-xs font-bold text-gray-500 mt-2 hover:text-[#5D3891] transition"
                         >
                           Balas
                         </button>
                      </div>
                   </div>

                   {/* Reply Input Form */}
                   {activeReplyId === induk.idKomentar && (
                      <div className="mt-3 ml-11 flex gap-2 animate-in fade-in slide-in-from-top-2">
                         <input 
                           autoFocus
                           className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-[#5D3891]"
                           placeholder={`Balas ${induk.guestName}...`}
                           value={inputKomentar}
                           onChange={(e) => setInputKomentar(e.target.value)}
                         />
                         <button onClick={() => handleKirim(induk.idKomentar)} disabled={isSending} className="bg-[#5D3891] text-white p-2 rounded-full">
                            <Send className="w-4 h-4" />
                         </button>
                      </div>
                   )}

                   {/* Replies List */}
                   {getReplies(induk.idKomentar).length > 0 && (
                     <div className="mt-3 ml-4 pl-4 border-l-2 border-gray-100 space-y-3">
                        {getReplies(induk.idKomentar).map((anak) => (
                           <div key={anak.idKomentar} className="flex gap-2">
                              <CornerDownRight className="w-4 h-4 text-gray-300 mt-2" />
                              <div className="bg-gray-50 p-3 rounded-xl w-full">
                                 <div className="flex justify-between">
                                    <span className="text-xs font-bold text-gray-800">{anak.guestName}</span>
                                    {isAdmin && (
                                      <button onClick={() => handleDelete(anak.idKomentar)} className="text-gray-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                    )}
                                 </div>
                                 <p className="text-sm text-gray-600 mt-0.5">{anak.isiKomentar}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                   )}
                </div>
             ))
           )}
        </div>

      </div>

      {/* 4. FOOTER INPUT FIXED */}
      {!activeReplyId && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50">
           <div className="max-w-2xl mx-auto flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                 <User className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1 relative">
                 <input 
                   type="text" 
                   className="w-full bg-gray-100 text-gray-800 rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D3891]/20 transition"
                   placeholder="Tulis komentar..."
                   value={inputKomentar}
                   onChange={(e) => setInputKomentar(e.target.value)}
                 />
                 <button 
                   onClick={() => handleKirim(null)}
                   disabled={isSending || !inputKomentar.trim()}
                   className="absolute right-2 top-1.5 p-1.5 bg-[#5D3891] rounded-full text-white hover:bg-[#4a2c75] disabled:opacity-50 transition"
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