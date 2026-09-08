import { useState } from 'react';
import { ArrowRight, ChevronRight, Download, Eye, Layers3, Sparkles } from 'lucide-react';
import { StudioShell, FieldLabel } from './_shared/StudioShell';
import { SelectPill, TagRow, UploadLinkBox } from './_shared/CreativeControls';
import './_group.css';

const concepts = [
  { tone:'High contrast', color:'#fb6f4c', label:'01', title:'الخط العربي المناسب؟', sub:'دليل سريع لكل مشروع', art:'from-[#3b1718] via-[#ec684b] to-[#ffb36c]', glyph:'خط' },
  { tone:'Editorial', color:'#65f2c0', label:'02', title:'كيف تختار الخط العربي المناسب؟', sub:'5 قواعد تغيّر اختيارك', art:'from-[#103b39] via-[#1a7770] to-[#b5f2c0]', glyph:'عربي' },
  { tone:'Quiet authority', color:'#b9a1ff', label:'03', title:'الخط الذي يليق بفكرتك', sub:'مقارنة عملية بلا تعقيد', art:'from-[#17152e] via-[#4d3984] to-[#bbaaf7]', glyph:'نون' },
];

export function YouTubeThumbnailMaker() {
  const [idea, setIdea] = useState('كيف تختار الخط العربي المناسب؟');
  const [tone, setTone] = useState('Editorial');
  const [generated, setGenerated] = useState(false);
  return <StudioShell active="thumbnail">
    <section className="xf-grid relative overflow-hidden border-y border-white/[.06]">
      <div className="mx-auto max-w-[1120px] px-5 pb-12 pt-12 text-center sm:px-8 sm:pb-16 sm:pt-16">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#65f2c0]/20 bg-[#65f2c0]/[.06] px-3 py-1.5 text-[11px] text-[#65f2c0]"><Sparkles size={13}/> xfontat AI / thumbnail studio</div>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-[1.06] tracking-[-.055em] text-[#f2f7f3] sm:text-6xl">Make the click feel<br/><span className="text-[#65f2c0]">before it happens.</span></h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-[#84928c]">حوّل فكرة الفيديو إلى صورة مصغّرة تتحدث بصوتك، وتترك للخط العربي مساحة ليظهر.</p>
      </div>
      <div className="mx-auto max-w-[840px] px-4 pb-12 sm:px-8">
        <div className="xf-glass rounded-[25px] p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-medium text-[#d7e4dc]"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#65f2c0]/15 text-[#65f2c0]">1</span> Start with the idea</div><span className="font-['DM_Mono'] text-[10px] text-[#56645e]">THUMBNAIL / 16:9</span></div>
          <FieldLabel hint="Required">Video idea or title</FieldLabel>
          <textarea value={idea} onChange={e=>setIdea(e.target.value)} className="xf-ar mb-4 h-24 w-full resize-none rounded-2xl border border-white/10 bg-[#0b1110] p-4 text-lg leading-8 text-[#eef6f0] outline-none placeholder:text-[#56635d] focus:border-[#65f2c0]/60" dir="rtl"/>
          <UploadLinkBox/>
          <div className="mt-5 grid gap-4 sm:grid-cols-2"><SelectPill label="Visual direction" options={['Editorial','High contrast','Quiet authority','Playful studio']}/><SelectPill label="Energy" options={['Focused','Electric','Warm','Cinematic']}/></div>
          <div className="mt-5"><FieldLabel>Color mood</FieldLabel><TagRow tags={['Teal / ink','Coral / cream','Lavender / night','Let xfontat choose']} value={tone} setValue={setTone}/></div>
          <button onClick={()=>setGenerated(true)} className="xf-button xf-pulse mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#65f2c0] py-4 text-sm font-semibold text-[#07100d]"><Sparkles size={17}/>{generated ? 'New concepts are ready' : 'Generate 3 thumbnail concepts'}<ArrowRight size={16}/></button>
          <p className="mt-3 text-center text-[11px] text-[#5e6d66]">You can refine the visual direction after the first pass.</p>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-[1120px] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-7 flex items-end justify-between"><div><p className="mb-2 font-['DM_Mono'] text-[10px] uppercase tracking-[.2em] text-[#65f2c0]">A first point of view</p><h2 className="text-2xl font-medium tracking-[-.035em]">Three ways to earn the pause.</h2></div><button className="hidden items-center gap-2 text-xs text-[#84928c] sm:flex">View all concepts <ChevronRight size={14}/></button></div>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr_.9fr]">{concepts.map((c,i)=><article key={c.label} className={`xf-reveal group ${i===0?'lg:translate-y-7':''}`} style={{animationDelay:`${i*100}ms`}}>
        <div className={`relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br ${c.art} p-5 shadow-2xl transition duration-300 group-hover:-translate-y-1`}><div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,.34),transparent_20%),linear-gradient(120deg,transparent_40%,rgba(0,0,0,.32))]"/><div className="relative flex h-full flex-col justify-between"><div className="flex justify-between text-[10px] font-['DM_Mono'] text-white/70"><span>{c.label} / {c.tone}</span><span>16:9</span></div><div className="text-right" dir="rtl"><div className="xf-ar text-3xl font-bold leading-tight text-white drop-shadow-lg sm:text-4xl">{c.title}</div><div className="xf-ar mt-2 text-sm text-white/80">{c.sub}</div></div><div className="flex items-center justify-between"><span className="text-xs font-medium text-white/70">xfontat / studio</span><span className="rounded-full px-3 py-1 text-xs font-bold text-[#08100e]" style={{backgroundColor:c.color}}>مشاهدة</span></div></div></div>
        <div className="flex items-center justify-between px-1 pt-3 text-xs text-[#84928c]"><span>{c.tone} direction</span><button className="flex items-center gap-1 text-[#dce8e1]"><Eye size={13}/> Preview</button></div>
      </article>)}</div>
      <div className="xf-glass mt-14 flex flex-col items-start justify-between gap-5 rounded-2xl p-5 sm:flex-row sm:items-center sm:p-6"><div className="flex items-center gap-4"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#65f2c0]/10 text-[#65f2c0]"><Layers3 size={20}/></div><div><p className="text-sm font-medium">Your thumbnail, not a template.</p><p className="mt-1 text-xs text-[#84928c]">Every concept starts with real Arabic type from the xfontat library.</p></div></div><button className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs text-[#dce8e1]"><Download size={14}/> Export board</button></div>
    </section>
  </StudioShell>
}