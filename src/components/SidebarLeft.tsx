"use client";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname untuk deteksi link aktif
import { Home, Hash, Heart, Info, BookOpen, Smile, Ghost } from "lucide-react";

export default function SidebarLeft() {
  const pathname = usePathname(); // Ambil URL saat ini

  // Fungsi cek aktif
  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { icon: Home, label: "Beranda", href: "/" },
    { icon: Hash, label: "Explore", href: "/explore" }, // Nanti buat page explore
    { icon: Info, label: "Info Kampus", href: "/info" }, // <--- SUDAH DIPERBAIKI
    { icon: BookOpen, label: "Akademik", href: "/kategori/akademik" },
    { icon: Heart, label: "Percintaan", href: "/kategori/percintaan" },
    { icon: Ghost, label: "Horor", href: "/kategori/horor" },
    { icon: Smile, label: "Humor", href: "/kategori/humor" },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">Menu Utama</h3>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive(item.href)
                      ? "bg-purple-50 text-[#5D3891] font-bold dark:bg-gray-700 dark:text-purple-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#5D3891] dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 px-6 py-3 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <Link href="/" className={`flex flex-col items-center ${isActive('/') ? 'text-[#5D3891]' : 'text-gray-400'}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </Link>
        <Link href="/explore" className={`flex flex-col items-center ${isActive('/explore') ? 'text-[#5D3891]' : 'text-gray-400'}`}>
          <Hash className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Explore</span>
        </Link>
        <Link href="/buat-laporan" className="flex flex-col items-center -mt-8">
          <div className="bg-[#5D3891] p-4 rounded-full shadow-lg border-4 border-[#F0F2F5] dark:border-gray-900 transform active:scale-95 transition">
             <div className="text-white font-bold text-xl">+</div>
          </div>
        </Link>
        <Link href="/info" className={`flex flex-col items-center ${isActive('/info') ? 'text-[#5D3891]' : 'text-gray-400'}`}>
          <Info className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Info</span>
        </Link>
        {/* Placeholder Menu (Bisa diganti Profile) */}
        <div className="flex flex-col items-center text-gray-400 opacity-50">
          <Heart className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Likes</span>
        </div>
      </div>
    </>
  );
}