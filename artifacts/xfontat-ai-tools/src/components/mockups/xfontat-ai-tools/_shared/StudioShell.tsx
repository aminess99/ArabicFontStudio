import { Link, Sparkles, Wand2, Type, Library, ArrowUpRight, Menu } from 'lucide-react';
import type { ReactNode } from 'react';
import '../_group.css';

export function StudioShell({ children, active }: { children: ReactNode; active: 'thumbnail' | 'logo' }) {
  return <div className="xf-shell xf-noise min-h-[100dvh]">
    <header className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 sm:px-9">
      <div className="flex items-center gap-8">
        <Link href="/__mockup/preview/xfontat-ai-tools/YouTubeThumbnailMaker" className="flex items-center gap-2 text-lg font-semibold tracking-[-.04em]">
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#65f2c0] text-[#08100e]"><Type size={17} strokeWidth={2.5}/></span>
          <span>xfontat<span className="text-[#65f2c0]">.</span></span>
        </Link>
        <div className="hidden h-5 w-px bg-white/10 sm:block"/>
        <nav className="hidden items-center gap-1 text-[12px] text-[#84928c] sm:flex">
          <Link href="/__mockup/preview/xfontat-ai-tools/YouTubeThumbnailMaker" className={`rounded-full px-3 py-2 transition hover:text-white ${active === 'thumbnail' ? 'bg-white/[.07] text-white' : ''}`}><Sparkles size={13} className="mr-1.5 inline"/>Thumbnail studio</Link>
          <Link href="/__mockup/preview/xfontat-ai-tools/LogoMaker" className={`rounded-full px-3 py-2 transition hover:text-white ${active === 'logo' ? 'bg-white/[.07] text-white' : ''}`}><Wand2 size={13} className="mr-1.5 inline"/>Logo studio</Link>
          <span className="ml-2 flex items-center gap-1.5 px-3 py-2"><Library size={13}/> Font library</span>
        </nav>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <button className="hidden text-[#aab8b2] transition hover:text-white sm:block">Sign in</button>
        <button className="xf-button rounded-full border border-[#65f2c0]/40 bg-[#65f2c0]/10 px-4 py-2.5 font-medium text-[#65f2c0]">Open xfontat</button>
        <button className="rounded-lg p-2 text-[#84928c] sm:hidden" aria-label="Open menu"><Menu size={18}/></button>
      </div>
    </header>
    <main>{children}</main>
    <footer className="mx-auto flex max-w-[1400px] items-center justify-between px-5 pb-7 pt-10 text-[11px] text-[#64736d] sm:px-9">
      <span>Arabic type, made visible.</span><span className="flex items-center gap-1">xfontat AI lab <ArrowUpRight size={12}/></span>
    </footer>
  </div>
}

export function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-[.14em] text-[#84928c]"><span>{children}</span>{hint && <span className="normal-case tracking-normal text-[#54635d]">{hint}</span>}</div>
}