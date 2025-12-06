"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Image as ImageIcon, MapPin, Send, X, 
  Smile, AlertTriangle, ChevronDown, Loader2, 
  User, BarChart3, ShieldCheck, Flame, Medal 
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

// Helper untuk Badge
const getBadge = (postCount: number) => {
  if (postCount > 50) return { label: "Suhu Kampus 🔥", color: "bg-red-100 text-red-600" };
  if (postCount > 20) return { label: "Aktif Banget ⚡", color: "bg-purple-100 text-purple-600" };
  if (postCount > 5)  return { label: "Warga Tetap 🏠", color: "bg-blue-100 text-blue-600" };
  return { label: "Mahasiswa Baru 🌱", color: "bg-green-100 text-green-600" };
};

export default function BuatMenfessPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    judul: "", 
    deskripsi: "",
    kategori: "Curhat", 
    lokasi: "",
    foto: "", 
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [guestId, setGuestId] = useState("");
  
  // STATE BARU: Data Statistik Real
  const [stats, setStats] = useState({ posts: 0, likes: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let id = localStorage.getItem("bisik_guest_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("bisik_guest_id", id);
    }
    setGuestId(id);

    // 2. Ambil Statistik Real dari Database
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/stats", {
          headers: { "x-device-id": id || "" }
        });
        const json = await res.json();
        if (json.success) setStats(json.data);
      } catch (e) {
        console.error("Gagal ambil stats");
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const badge = getBadge(stats.posts);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        toast.error("Maksimal 2MB ya!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, foto: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if(!formData.deskripsi.trim()) {
      toast.error("Jangan kirim pesan kosong dong 😔");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Mengirim rahasiamu...");
    
    try {
      const payload = { 
        ...formData, 
        judul: formData.deskripsi.substring(0, 30) + "...", 
        deviceId: guestId 
      };
      
      const res = await fetch("/api/laporan", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-device-id": guestId || "" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Terkirim! 🚀", { id: toastId });
        router.push("/");
      } else {
        throw new Error("Gagal");
      }
    } catch (e) { 
      toast.error("Gagal kirim, coba lagi nanti.", { id: toastId });
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-gray-900 font-sans">
      
      {/* NAVBAR MATCHING DASHBOARD */}
      <div className="bg-white dark:bg-gray-800 px-4 md:px-8 py-3 flex justify-between items-center shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
           <Image src="/logo-kucing.png" alt="Logo" width={38} height={38} />
           <span className="font-extrabold text-xl bg-gradient-to-r from-[#5D3891] to-purple-500 bg-clip-text text-transparent tracking-tight hidden md:block">
             BisikKampus
           </span>
        </div>
        <div className="font-bold text-gray-700 dark:text-gray-200 text-sm">Mode Penulis</div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 px-4 md:px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* === KOLOM KIRI (Real Profile Stats) === */}
        <div className="hidden lg:block col-span-1 space-y-6">
           <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center sticky top-24">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#5D3891] to-purple-400 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner">
                🐱
              </div>
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Guest-{guestId.substring(0,4)}</h2>
              
              {/* BADGE SYSTEM */}
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1 ${badge.color}`}>
                 <Medal className="w-3 h-3" /> {badge.label}
              </div>
              
              <div className="grid grid-cols-2 gap-2 border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                 <div>
                    <div className="text-xl font-bold text-[#5D3891] dark:text-purple-400">
                      {loadingStats ? "..." : stats.posts}
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Postingan</div>
                 </div>
                 <div>
                    <div className="text-xl font-bold text-[#5D3891] dark:text-purple-400">
                      {loadingStats ? "..." : stats.likes}
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Likes Diberi</div>
                 </div>
              </div>

              <button 
                onClick={() => router.back()}
                className="w-full mt-6 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Batal & Kembali
              </button>
           </div>
        </div>

        {/* === KOLOM TENGAH (Composer Full) === */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[500px] flex flex-col relative">
            
            {/* Toolbar Atas */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex flex-wrap gap-3 items-center">
               <div className="relative group">
                  <select 
                    name="kategori" 
                    value={formData.kategori} 
                    onChange={handleChange}
                    className="appearance-none pl-9 pr-8 py-2.5 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-bold text-gray-700 dark:text-white hover:border-[#5D3891] focus:ring-2 focus:ring-purple-100 transition cursor-pointer shadow-sm outline-none"
                  >
                    <option value="Curhat">Curhat</option>
                    <option value="Confess">Confess</option>
                    <option value="Info">Info Kampus</option>
                    <option value="Horor">Horor</option>
                    <option value="Humor">Humor</option>
                  </select>
                  <div className="absolute left-3 top-3 text-[#5D3891]">
                    <Flame className="w-4 h-4" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
               </div>

               <div className="flex-1 relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    name="lokasi"
                    placeholder="Lokasi kejadian (Opsional)"
                    className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:border-[#5D3891] focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition shadow-sm outline-none placeholder-gray-400"
                    value={formData.lokasi}
                    onChange={handleChange}
                  />
               </div>
            </div>

            {/* Textarea Luas */}
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="Tuliskan ceritamu di sini, Guest..."
              className="flex-1 w-full p-6 text-lg text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 outline-none resize-none leading-relaxed bg-transparent"
              maxLength={1000}
              autoFocus
            />

            {/* Preview Image */}
            {formData.foto && (
              <div className="px-6 pb-4 animate-in fade-in zoom-in duration-300">
                <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm inline-block max-h-64">
                  <img src={formData.foto} className="h-full w-auto object-contain" alt="Preview" />
                  <button 
                    onClick={() => setFormData({...formData, foto: ""})} 
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-red-500 transition backdrop-blur-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Footer Toolbar */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 sticky bottom-0 z-10">
               <div className="flex gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2.5 rounded-full transition ${formData.foto ? 'bg-purple-100 text-[#5D3891]' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    title="Upload Foto"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                    <Smile className="w-5 h-5" />
                  </button>
               </div>

               <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold ${formData.deskripsi.length > 900 ? 'text-red-500' : 'text-gray-300 dark:text-gray-600'}`}>
                    {formData.deskripsi.length} / 1000
                  </span>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !formData.deskripsi.trim()}
                    className="bg-[#5D3891] hover:bg-[#4a2c75] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Kirim <Send className="w-4 h-4" /></>}
                  </button>
               </div>
            </div>

          </div>
        </div>

        {/* === KOLOM KANAN (Rules & Info) === */}
        <div className="hidden lg:block col-span-1 space-y-6">
           <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-5 shadow-sm border border-yellow-100 dark:border-yellow-900/30 sticky top-24">
              <h3 className="font-bold text-yellow-700 dark:text-yellow-500 mb-3 flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4" /> Aturan Main
              </h3>
              <ul className="space-y-3">
                 {[
                   "Dilarang menyebut nama lengkap (doxing).",
                   "Hindari ujaran kebencian & SARA.",
                   "Gunakan bahasa yang sopan.",
                   "Foto vulgar akan langsung dibanned."
                 ].map((rule, i) => (
                   <li key={i} className="flex items-start gap-2 text-xs text-yellow-800/80 dark:text-yellow-200/80 leading-relaxed">
                      <ShieldCheck className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      {rule}
                   </li>
                 ))}
              </ul>
           </div>
        </div>

      </div>
    </div>
  );
}