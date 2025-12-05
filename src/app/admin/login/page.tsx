"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Toast Loading
    const toastId = toast.loading("Memverifikasi kredensial...");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error);
      }

      // Simpan sesi
      localStorage.setItem("bisik_admin_token", "logged_in");
      localStorage.setItem("bisik_admin_name", json.data.nama);
      
      toast.success("Login Berhasil! Mengalihkan...", { id: toastId });
      
      // Delay sedikit biar transisi halus
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 800);

    } catch (err: any) {
      toast.error(err.message || "Login gagal", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#09090B] relative overflow-hidden font-sans selection:bg-purple-500/30 text-white">
      
      {/* 1. Background Effects (Aurora Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none"></div>

      {/* 2. Glass Card Container */}
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-[#18181B]/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 relative overflow-hidden group">
          
          {/* Border Glow Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

          {/* Header Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#18181B] to-black rounded-full flex items-center justify-center border border-white/10 shadow-lg shadow-purple-900/20 mb-4 animate-in zoom-in duration-500">
               <Image src="/logo-kucing.png" alt="Logo" width={48} height={48} className="object-contain" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Admin Portal
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Area Terbatas
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Input Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Masukkan username"
                  className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all text-sm placeholder-gray-600 text-white"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all text-sm placeholder-gray-600 text-white"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-[#5D3891] to-purple-600 hover:from-[#4a2c75] hover:to-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk Sistem
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-600">
              Lupa password? Hubungi tim IT atau <span className="text-purple-400 hover:text-purple-300 cursor-pointer underline decoration-dotted">reset di database</span>.
            </p>
          </div>

        </div>
        
        <p className="text-center text-xs text-gray-700 mt-6 font-mono">
          BisikKampus Secure Gateway v1.0
        </p>
      </div>
    </div>
  );
}