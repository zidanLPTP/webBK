"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, FileText, CheckCircle, XCircle, 
  LogOut, ShieldAlert, Clock, Check, X, Trash2, Search,
  Eye, Filter, ChevronLeft, ChevronRight
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

  useEffect(() => {
    const token = localStorage.getItem("bisik_admin_token");
    const name = localStorage.getItem("bisik_admin_name");

    if (!token) {
      router.push("/admin/login");
    } else {
      setAdminName(name || "Admin");
      fetchData(activeTab);
    }
  }, [activeTab]);

  const fetchData = async (tab: string) => {
    setIsLoading(true);
    let dbStatus = "Pending";
    if (tab === "Aktif") dbStatus = "Ditanggapi";
    
    try {
      const res = await fetch(`/api/admin/laporan?status=${dbStatus}`);
      const json = await res.json();
      if (json.success) setLaporanList(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModerasi = async (id: string, newStatus: string) => {
    const toastId = toast.loading("Memproses...");
    try {
      await fetch("/api/admin/laporan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      
      toast.success(`Sukses: ${newStatus}`, { id: toastId });
      setSelectedLaporan(null); 
      fetchData(activeTab); 
    } catch (e) {
      toast.error("Gagal update", { id: toastId });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bisik_admin_token");
    router.push("/admin/login");
  };

  // Helper Warna Kategori (Versi Dark Mode)
  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'Horor': return 'bg-gray-800 text-gray-300 border-gray-600';
      case 'Info': return 'bg-blue-900/30 text-blue-300 border-blue-800';
      case 'Curhat': return 'bg-purple-900/30 text-purple-300 border-purple-800';
      default: return 'bg-green-900/30 text-green-300 border-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] font-sans flex text-gray-200 selection:bg-purple-500/30">
      
      {/* 1. SIDEBAR (Dark Theme) */}
      <aside className="w-64 bg-[#18181B] hidden md:flex flex-col border-r border-gray-800 p-6 sticky top-0 h-screen z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
           <Image src="/logo-kucing.png" alt="Logo" width={32} height={32} />
           <span className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
             AdminPanel
           </span>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-[10px] font-bold text-gray-500 uppercase px-4 mb-2 tracking-widest">Main Menu</p>
          
          <button
            onClick={() => setActiveTab("Pending")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium border border-transparent ${
              activeTab === "Pending" 
                ? "bg-purple-500/10 text-purple-400 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <ShieldAlert className="w-5 h-5" /> Moderasi Masuk
            {activeTab !== "Pending" && <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
          </button>
          
          <button
            onClick={() => setActiveTab("Aktif")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium border border-transparent ${
              activeTab === "Aktif" 
                ? "bg-purple-500/10 text-purple-400 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" /> Postingan Aktif
          </button>
        </nav>

        {/* Profile Admin */}
        <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl flex items-center gap-3 mb-4">
           <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {adminName.charAt(0)}
           </div>
           <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{adminName}</p>
              <p className="text-xs text-gray-500">Super Admin</p>
           </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 px-4 py-2 rounded-lg transition text-sm font-bold"><LogOut className="w-4 h-4" /> Logout</button>
      </aside>

      {/* 2. MAIN CONTENT (Dark Theme) */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen w-full relative">
        
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-96 bg-purple-900/20 blur-[100px] pointer-events-none -z-10" />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
           <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {activeTab === "Pending" ? "Moderasi Laporan" : "Database Postingan"}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Kelola keamanan komunitas BisikKampus.
              </p>
           </div>
           <div className="flex gap-3 w-full md:w-auto">
              <div className="bg-[#18181B] px-4 py-2.5 rounded-xl border border-gray-700 flex items-center gap-2 shadow-sm flex-1 md:w-64 focus-within:border-purple-500 transition-colors">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input type="text" placeholder="Cari ID / Isi..." className="outline-none text-sm w-full bg-transparent text-white placeholder-gray-600" />
              </div>
              <button className="p-2.5 bg-[#18181B] border border-gray-700 rounded-xl hover:bg-gray-800 text-gray-400 shadow-sm transition">
                  <Filter className="w-5 h-5" />
              </button>
           </div>
        </div>

        {/* 3. TABLE VIEW (Dark & Modern) */}
        <div className="bg-[#18181B] rounded-3xl shadow-xl border border-gray-800 overflow-hidden">
          
          {isLoading ? (
             <div className="p-20 text-center text-gray-500 flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin mb-3"></div>
                Mengambil data terenkripsi...
             </div>
          ) : laporanList.length === 0 ? (
             <div className="p-20 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                   <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-bold text-white">Semua Bersih!</h3>
                <p className="text-sm mt-2">Tidak ada laporan di kategori ini.</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-900/50 border-b border-gray-800 text-xs uppercase text-gray-500 font-bold tracking-wider">
                    <th className="p-6">Pelapor</th>
                    <th className="p-6">Konten Laporan</th>
                    <th className="p-6">Kategori</th>
                    <th className="p-6">Tanggal</th>
                    <th className="p-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {laporanList.map((item) => (
                    <tr 
                      key={item.idLaporan} 
                      onClick={() => setSelectedLaporan(item)} 
                      className="hover:bg-white/5 transition cursor-pointer group"
                    >
                      {/* Pelapor */}
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-purple-400 font-bold text-xs border border-gray-700">
                            {item.pelaporId.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-200 text-sm group-hover:text-purple-400 transition">Guest-{item.pelaporId.substring(0,4)}</p>
                            <p className="text-xs text-gray-500">Anonim</p>
                          </div>
                        </div>
                      </td>

                      {/* Konten */}
                      <td className="p-6 max-w-xs">
                        <p className="text-sm text-gray-400 truncate font-medium group-hover:text-gray-200 transition">
                          {item.deskripsi}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                           {item.foto && (
                             <span className="text-[10px] bg-blue-900/20 text-blue-400 px-2 py-0.5 rounded flex items-center gap-1 border border-blue-900/50">
                               <FileText className="w-3 h-3" /> Gambar
                             </span>
                           )}
                           <span className="text-[10px] text-gray-600">
                             {item.lokasi || "Lokasi tidak ada"}
                           </span>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getCategoryColor(item.kategori)}`}>
                          {item.kategori}
                        </span>
                      </td>

                      {/* Tanggal */}
                      <td className="p-6">
                        <span className="text-sm text-gray-500 font-mono">
                          {item.tanggal ? formatDistanceToNow(new Date(item.tanggal), { addSuffix: true, locale: idLocale }) : "-"}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="p-6 text-right">
                        <button className="p-2 rounded-full hover:bg-purple-500/20 text-gray-500 hover:text-purple-400 transition">
                           <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Footer Table */}
          <div className="p-4 border-t border-gray-800 flex justify-between items-center text-sm text-gray-500 bg-[#18181B]">
             <span>Menampilkan {laporanList.length} data</span>
             <div className="flex gap-1">
                <button className="p-1 rounded hover:bg-gray-800 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
                <button className="p-1 rounded hover:bg-gray-800"><ChevronRight className="w-5 h-5" /></button>
             </div>
          </div>
        </div>

      </main>

      {/* 4. MODAL DETAIL (Dark Mode) */}
      {selectedLaporan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#18181B] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] border border-gray-800">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#18181B]">
               <div>
                 <h3 className="font-bold text-white text-lg">Detail Laporan</h3>
                 <p className="text-xs text-gray-500 font-mono mt-1">ID: {selectedLaporan.idLaporan}</p>
               </div>
               <button onClick={() => setSelectedLaporan(null)} className="p-2 hover:bg-gray-800 rounded-full transition text-gray-400 hover:text-white">
                 <X className="w-5 h-5" />
               </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
               {/* User Info */}
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-purple-400 font-bold text-lg border border-gray-700">
                    {selectedLaporan.pelaporId.substring(0,1)}
                  </div>
                  <div>
                    <p className="font-bold text-white">Guest-{selectedLaporan.pelaporId}</p>
                    <div className="flex gap-2 text-xs mt-1">
                       <span className="bg-purple-900/30 text-purple-300 border border-purple-800 px-2 py-0.5 rounded">{selectedLaporan.kategori}</span>
                       <span className="bg-gray-800 text-gray-400 px-2 py-0.5 rounded flex items-center gap-1">📍 {selectedLaporan.lokasi || "-"}</span>
                    </div>
                  </div>
               </div>

               {/* Content Text */}
               <div className="bg-[#09090B] p-5 rounded-2xl border border-gray-800 mb-6">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
                    {selectedLaporan.deskripsi}
                  </p>
               </div>

               {/* Content Image */}
               {selectedLaporan.foto && (
                 <div className="mb-6 rounded-xl overflow-hidden border border-gray-800 bg-[#09090B]">
                    <img src={selectedLaporan.foto} className="w-full h-auto object-contain max-h-96" />
                 </div>
               )}

               {/* Stats */}
               <div className="flex gap-4 text-sm text-gray-500 border-t border-gray-800 pt-4">
                  <span className="flex items-center gap-2"><span className="text-purple-400">💜</span> {selectedLaporan.jumlahLikes || 0} Likes</span>
                  <span className="flex items-center gap-2"><span className="text-blue-400">💬</span> {selectedLaporan.jumlahKomentar || 0} Komentar</span>
               </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-800 bg-[#18181B] flex justify-end gap-3 sticky bottom-0">
               {activeTab === "Pending" ? (
                 <>
                   <button 
                     onClick={() => handleModerasi(selectedLaporan.idLaporan, "Ditolak")}
                     className="px-6 py-2.5 rounded-xl border border-red-900/50 text-red-400 font-bold hover:bg-red-900/20 transition flex items-center gap-2"
                   >
                     <XCircle className="w-4 h-4" /> Tolak
                   </button>
                   <button 
                     onClick={() => handleModerasi(selectedLaporan.idLaporan, "Ditanggapi")}
                     className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition flex items-center gap-2 shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                   >
                     <Check className="w-4 h-4" /> Terima & Posting
                   </button>
                 </>
               ) : (
                 <>
                   <button 
                     onClick={() => handleModerasi(selectedLaporan.idLaporan, "Ditolak")}
                     className="px-6 py-2.5 rounded-xl bg-red-900/20 text-red-400 border border-red-900/50 font-bold hover:bg-red-900/40 transition flex items-center gap-2"
                   >
                     <Trash2 className="w-4 h-4" /> Take Down
                   </button>
                   <button 
                     onClick={() => handleModerasi(selectedLaporan.idLaporan, "Selesai")}
                     className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 transition flex items-center gap-2 shadow-[0_0_15px_rgba(22,163,74,0.3)]"
                   >
                     <CheckCircle className="w-4 h-4" /> Tandai Selesai
                   </button>
                 </>
               )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}