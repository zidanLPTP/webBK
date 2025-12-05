import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";

// Helper Component untuk Heat Bar
const HeatBar = ({ count, max }: { count: number; max: number }) => {
  const percentage = Math.min((count / max) * 100, 100);
  return (
    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default function SidebarRight({ trendingList }: { trendingList: any[] }) {
  const maxCount = trendingList.length > 0 ? trendingList[0].count : 10;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
        <div className="flex justify-between items-center mb-5">
           <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
             <TrendingUp className="w-5 h-5 text-[#5D3891]" /> 
             Lagi Panas Panasnya Pekanbaru
           </h3>
        </div>
        
        <div className="space-y-5">
          {trendingList.map((topic, idx) => (
            <div key={topic.kategori} className="group cursor-pointer">
              <div className="flex justify-between items-end mb-1">
                <div>
                   <span className="text-xs font-bold text-gray-400">#{idx + 1} Trending</span>
                   <p className="font-bold text-gray-800 dark:text-gray-200 text-sm group-hover:text-[#5D3891] transition">
                     {topic.kategori}
                   </p>
                </div>
                <span className="text-xs font-bold text-[#5D3891] bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md">
                  {topic.count} Post
                </span>
              </div>
              {/* Heat Bar Visual */}
              <HeatBar count={topic.count} max={maxCount} />
            </div>
          ))}
          
          {trendingList.length === 0 && (
             <p className="text-sm text-gray-400 italic">Belum ada topik panas.</p>
          )}
        </div>

        <button className="w-full mt-6 py-2 text-sm font-bold text-gray-500 hover:text-[#5D3891] hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition flex items-center justify-center gap-2">
           Lihat Semua <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Footer Kecil yang SUDAH BERFUNGSI */}
      <div className="text-xs text-gray-400 px-2 leading-relaxed text-center">
        &copy; 2025 BisikKampus.<br/>
        <Link href="/privacy" className="hover:underline cursor-pointer hover:text-[#5D3891]">Privacy</Link> • 
        <Link href="/terms" className="hover:underline cursor-pointer hover:text-[#5D3891] ml-1">Terms</Link>
      </div>
    </div>
  );
}