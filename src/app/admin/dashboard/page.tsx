"use client";

import { useEffect, useState, useCallback } from "react"; // Tambah useCallback
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, CheckCircle, XCircle, 
  LogOut, ShieldAlert, FileText, Check, X, Trash2, Search,
  Eye, Filter, ChevronLeft, ChevronRight, Archive, Ban
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type LaporanView = {
  idLaporan: string;
  deskripsi: string;
  lokasi: string;
  kategori: string;
  foto: string | null;
  pelaporId: string;
  status: string;
  tanggal: string;
  jumlahLikes: number;
  jumlahKomentar: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Pending"); 
  const [laporanList, setLaporanList] = useState<LaporanView[]>([]);
  const [adminName, setAdminName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLaporan, setSelectedLaporan] = useState<LaporanView | null>(null);

  // 1. Definisikan fetchData dengan useCallback agar stabil dan tidak re-render terus
  const fetchData = useCallback(async (tab: string) => {
    setIsLoading(true);
    
    // MAPPING TAB KE STATUS DATABASE
    let dbStatus = "Pending";
    if (tab === "Aktif") dbStatus = "Ditanggapi";
    if (tab === "Selesai") dbStatus = "Selesai";
    if (tab === "Ditolak") dbStatus = "Ditolak";
    
    try {
      const res = await fetch(`/api/admin/laporan?status=${dbStatus}`);
      const json = await res.json();
      if (json.success) setLaporanList(json.data);
      else setLaporanList([]); 
    } catch (e) {
      console.error(e);
      toast.error("Gagal mengambil data");
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependency array kosong karena tidak bergantung pada state luar yang berubah

  // 2. useEffect sekarang aman
  useEffect(() => {
    const token = localStorage.getItem("bisik_admin_token");
    const name = localStorage.getItem("bisik_admin_name");

    if (!token) {
      router.push("/admin/login");
    } else {
      setAdminName(name || "Admin");
      fetchData(activeTab);
    }
  }, [activeTab, fetchData, router]); // Dependency lengkap

  const handleModerasi = async (id: string, newStatus: string) => {
    const toastId = toast.loading("Memproses...");
    try {
      await fetch("/api/admin/laporan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      
      toast.success(`Status diubah: ${newStatus}`, { id: toastId });
      setSelectedLaporan(null); 
      fetchData(activeTab); 
    } catch (e) {
      toast.error("Gagal update", { id: toastId });
    }
  };

  const handleLogout = () => {
    fetch("/api/admin/logout", { method: "POST" }); // Clear cookie
    localStorage.removeItem("bisik_admin_token");
    router.push("/admin/login");
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'Horor': return 'bg-gray-800 text-gray-300 border-gray-600';
      case 'Info': return 'bg-blue-900/30 text-blue-300 border-blue-800';
      case 'Curhat': return 'bg-purple-900/30 text-purple-300 border-purple-800';
      default: return 'bg-green-900/30 text-green-300 border-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] font-sans flex text-gray-200">
      
      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-[#18181B] hidden md:flex flex-col border-r border-gray-800 p-6 sticky top-0 h-screen z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
           <Image src="/logo-kucing.png" alt="Logo" width={32} height={32} />
           <span className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
             AdminPanel
           </span>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-[10px] font-bold text-gray-500 uppercase px-4 mb-2 tracking-widest">Main Menu</p>
          
          <button onClick={() => setActiveTab("Pending")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium border border-transparent ${activeTab === "Pending" ? "bg-purple-500/10 text-purple-400 border-purple-500/50" : "text-gray-400 hover:bg-white/5"}`}>
            <ShieldAlert className="w-5 h-5" /> Moderasi Masuk
            {activeTab !== "Pending" && <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
          </button>
          
          <button onClick={() => setActiveTab("Aktif")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium border border-transparent ${activeTab === "Aktif" ? "bg-purple-500/10 text-purple-400 border-purple-500/50" : "text-gray-400 hover:bg-white/5"}`}>
            <LayoutDashboard className="w-5 h-5" /> Postingan Aktif
          </button>

          <p className="text-[10px] font-bold text-gray-500 uppercase px-4 mb-2 mt-6 tracking-widest">Arsip & Riwayat</p>
          
          <button onClick={() => setActiveTab("Selesai")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium border border-transparent ${activeTab === "Selesai" ? "bg-green-500/10 text-green-400 border-green-500/50" : "text-gray-400 hover:bg-white/5"}`}>
            <Archive className="w-5 h-5" /> Selesai / Arsip
          </button>

          <button onClick={() => setActiveTab("Ditolak")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium border border-transparent ${activeTab === "Ditolak" ? "bg-red-500/10 text-red-400 border-red-500/50" : "text-gray-400 hover:bg-white/5"}`}>
            <Ban className="w-5 h-5" /> Sampah / Ditolak
          </button>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg transition text-sm font-bold"><LogOut className="w-4 h-4" /> Logout</button>
      </aside>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen w-full relative">
        <div className="flex justify-between items-center mb-8">
           <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {activeTab === "Pending" && "Moderasi Laporan"}
                {activeTab === "Aktif" && "Database Postingan Aktif"}
                {activeTab === "Selesai" && "Arsip Laporan Selesai"}
                {activeTab === "Ditolak" && "Tong Sampah Laporan"}
              </h1>
              <p className="text-gray-400 text-sm mt-1">Kelola data BisikKampus.</p>
           </div>
        </div>

        {/* TABLE */}
        <div className="bg-[#18181B] rounded-3xl shadow-xl border border-gray-800 overflow-hidden">
          {isLoading ? (
             <div className="p-20 text-center text-gray-500 flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin mb-3"></div>
                Memuat data...
             </div>
          ) : laporanList.length === 0 ? (
             <div className="p-20 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                   <CheckCircle className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="font-bold text-white">Kosong</h3>
                <p className="text-sm mt-2">Tidak ada data di tab ini.</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-900/50 border-b border-gray-800 text-xs uppercase text-gray-500 font-bold tracking-wider">
                    <th className="p-6">Pelapor</th>
                    <th className="p-6">Konten</th>
                    <th className="p-6">Kategori</th>
                    <th className="p-6">Tanggal</th>
                    <th className="p-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {laporanList.map((item) => (
                    <tr key={item.idLaporan} onClick={() => setSelectedLaporan(item)} className="hover:bg-white/5 transition cursor-pointer group">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-purple-400 font-bold text-xs border border-gray-700">
                            {item.pelaporId.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-200 text-sm">Guest-{item.pelaporId.substring(0,4)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 max-w-xs"><p className="text-sm text-gray-400 truncate">{item.deskripsi}</p></td>
                      <td className="p-6"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getCategoryColor(item.kategori)}`}>{item.kategori}</span></td>
                      <td className="p-6"><span className="text-sm text-gray-500 font-mono">{item.tanggal ? formatDistanceToNow(new Date(item.tanggal), { addSuffix: true, locale: idLocale }) : "-"}</span></td>
                      <td className="p-6 text-right"><button className="p-2 rounded-full hover:bg-purple-500/20 text-gray-500 hover:text-purple-400"><Eye className="w-5 h-5" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* MODAL DETAIL (Dengan Tombol Lengkap) */}
      {selectedLaporan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#18181B] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-800">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#18181B]">
               <h3 className="font-bold text-white text-lg">Detail Laporan</h3>
               <button onClick={() => setSelectedLaporan(null)} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto">
               <div className="bg-[#09090B] p-5 rounded-2xl border border-gray-800 mb-6">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedLaporan.deskripsi}</p>
               </div>
               {selectedLaporan.foto && <img src={selectedLaporan.foto} className="w-full h-auto rounded-xl border border-gray-800 mb-6" />}
            </div>
            
            {/* FOOTER ACTIONS: KONTROL PENUH */}
            <div className="p-6 border-t border-gray-800 bg-[#18181B] flex justify-end gap-3 flex-wrap">
               
               {/* 1. Tombol Aktifkan (Jika belum aktif) */}
               {selectedLaporan.status !== "Ditanggapi" && (
                 <button onClick={() => handleModerasi(selectedLaporan.idLaporan, "Ditanggapi")} className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 flex items-center gap-2">
                   <Check className="w-4 h-4" /> Posting (Aktif)
                 </button>
               )}

               {/* 2. Tombol Selesai (Arsip) */}
               {selectedLaporan.status !== "Selesai" && (
                 <button onClick={() => handleModerasi(selectedLaporan.idLaporan, "Selesai")} className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 flex items-center gap-2">
                   <CheckCircle className="w-4 h-4" /> Tandai Selesai
                 </button>
               )}

               {/* 3. Tombol Tolak/Hapus */}
               {selectedLaporan.status !== "Ditolak" && (
                 <button onClick={() => handleModerasi(selectedLaporan.idLaporan, "Ditolak")} className="px-4 py-2 rounded-xl border border-red-900 text-red-500 font-bold hover:bg-red-900/20 flex items-center gap-2">
                   <XCircle className="w-4 h-4" /> Tolak / Take Down
                 </button>
               )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}