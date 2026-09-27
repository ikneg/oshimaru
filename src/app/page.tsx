import { PosterWall } from "@/components/poster-wall";
import { getPublicPosters } from "@/lib/data";

export default async function Home({ searchParams }: { searchParams: Promise<{ poster?: string; demo?: string }> }) {
  const query = await searchParams;
  const { posters, demo } = await getPublicPosters({ forceDemo: query.demo === "1" });
  return <main className="desktop-pattern min-h-screen" aria-labelledby="app-title">
    <section className="min-h-screen bg-[#c0c0c0]" aria-label="oshimaru 公開ポスターウォール">
      <header className="app-header"><h1 id="app-title">oshimaru</h1><span className="app-header-meta">デジタル広告ウォール{demo ? "　｜　開発用サンプル" : ""}</span></header>
      <div className="min-h-[calc(100vh-82px)] bg-[#c0c0c0] px-2 py-4 sm:px-5 sm:py-6"><PosterWall posters={posters} initialPosterId={query.poster} /></div>
      <div className="app-statusbar">{posters.length} 個のオブジェクト　｜　公開中のポスター</div>
    </section>
  </main>;
}
