export default function Loading() {
  return <main className="mono-desktop flex items-center justify-center" aria-busy="true"><div className="mono-window mono-dialog w-full max-w-xl"><div className="mono-titlebar"><span>oshimaru / loading</span></div><div className="mono-dialog-body space-y-4"><p>読み込んでいます...</p><div className="win-inset win-progress" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div></div></div></main>;
}
