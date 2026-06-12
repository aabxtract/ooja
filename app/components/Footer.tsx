import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[#27272A] bg-[#09090B] py-10 mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center">
          <Image src="/logo-new.png" alt="Ooja Logo" width={140} height={40} className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
        </div>
        <div className="text-sm font-bold text-[#A1A1AA]">
          © 2026 Ooja Markets. Built on Stacks.
        </div>
        <div className="flex gap-6 text-sm font-black text-[#71717A]">
          <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          <Link href="#" className="hover:text-white transition-colors">Discord</Link>
          <Link href="#" className="hover:text-white transition-colors">Docs</Link>
        </div>
      </div>
    </footer>
  );
}
