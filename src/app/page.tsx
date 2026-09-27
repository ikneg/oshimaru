import { PosterWall } from "@/components/poster-wall";
import { getPublicPosters } from "@/lib/data";

export default async function Home({ searchParams }: { searchParams: Promise<{ poster?: string; demo?: string }> }) {
  const query = await searchParams;
  const { posters, demo } = await getPublicPosters({ forceDemo: query.demo === "1" });
  return <main className="desktop-pattern min-h-screen p-2 sm:p-4">
    <section className="win-window mx-auto max-w-[1600px]" aria-labelledby="app-title">
      <header className="win-titlebar"><h1 id="app-title">oshimaru</h1><span className="text-xs font-normal">デジタル広告ウォール</span></header>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#808080] bg-[#c0c0c0] px-3 py-2 text-xs">
        <span>{posters.length}枚のポスターを表示中</span>
        {demo && <span className="border border-black bg-[#ffffcc] px-2 py-1">開発用サンプル表示</span>}
      </div>
    </section>
    <div className="mx-auto max-w-[1540px] px-1 py-5 sm:px-4 sm:py-7"><PosterWall posters={posters} initialPosterId={query.poster} /></div>
  </main>;
}
