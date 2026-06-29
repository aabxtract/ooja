import Header from "../components/Header";
import MarketsGrid from "../components/MarketsGrid";

export default function MarketsPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white font-sans flex flex-col selection:bg-[#FF8A00] selection:text-black">
      <Header />
      <div className="flex-1 max-w-[1440px] w-full mx-auto p-4 lg:p-8">
        <h1 className="text-4xl font-black mb-8 text-white">Explore Markets</h1>
        <MarketsGrid />
      </div>
    </main>
  );
}
