import { PosterWall } from "@/components/poster-wall";
import { getPublicPosters } from "@/lib/data";

export default async function Home({ searchParams }: { searchParams: Promise<{ poster?: string; demo?: string }> }) {
  const query = await searchParams;
  const { posters } = await getPublicPosters({ forceDemo: query.demo === "1" });
  return <main className="mono-desktop" aria-labelledby="app-title">
    <section className="mono-window" aria-label="oshimaru 公開ポスターウォール">
      <header className="mono-titlebar">
        <h1 id="app-title">oshimaru</h1>
        <span className="mono-controls" aria-hidden="true"><i>_</i><i>□</i><i>×</i></span>
      </header>
      <div className="mono-wall">
      <PosterWall posters={posters} initialPosterId={query.poster} />
      </div>
    </section>
  </main>;
}
