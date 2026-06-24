import Link from "next/link";
import Image from "next/image";

export default function Header({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <header className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-xl px-6 lg:px-8">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center">
          <Image src="/logo-new.png" alt="Ooja Logo" width={200} height={56} className="h-14 w-auto object-contain drop-shadow-sm" priority />
        </Link>
        <nav className="hidden md:flex gap-8 text-sm font-bold text-[#A1A1AA]">
          <Link href="/markets" className="hover:text-white transition-colors">Markets</Link>
          <Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
          <Link href="/activity" className="hover:text-white transition-colors">Activity</Link>
        </nav>
      </div>
      
      <div className="flex-1 max-w-xl mx-8 hidden lg:block">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search markets, events, or categories..." 
            className="w-full bg-[#18181B] border border-[#27272A] focus:border-[#FF8A00] text-white text-sm font-medium rounded-full py-2.5 px-5 pl-12 outline-none transition-all duration-300"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] text-lg">
             🔍
          </span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-white">4,205.50 STX</span>
              <span className="text-xs text-[#22C55E] font-medium">+$120.00 (2.5%)</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#18181B] border border-[#27272A] flex items-center justify-center text-lg cursor-pointer hover:border-[#FF8A00] transition-colors">
              👤
            </div>
          </div>
        ) : (
          <>
            <Link href="/auth" className="hidden sm:block text-sm font-bold text-[#A1A1AA] hover:text-white transition-colors">Log In</Link>
            <Link href="/auth" className="rounded-full bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] px-6 py-2.5 text-sm font-black text-black transition-transform hover:scale-105 shadow-[0_0_15px_rgba(255,138,0,0.3)]">
              Connect
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
