import { useState } from 'react';
import { ArrowRight, Check, Download, Eraser, MoveDiagonal, Sparkles, Wand2 } from 'lucide-react';
import { StudioShell, FieldLabel } from './_shared/StudioShell';
import { SelectPill, TagRow } from './_shared/CreativeControls';
import './_group.css';

const variants = [
  { id:'A', className:'font-black', accent:'#65f2c0', label:'Monoline / precise', mark:'ن', shape:'rounded-[42%_58%_45%_55%]' },
  { id:'B', className:'font-semibold', accent:'#f2c68d', label:'Heritage / warm', mark:'ن', shape:'rounded-[55%_45%_60%_40%]' },
  { id:'C', className:'font-medium', accent:'#c2aeff', label:'Geometric / quiet', mark:'ن', shape:'rounded-[22%]' },
];
export function LogoMaker() {
  const [brand, setBrand] = useState('استوديو نون');
  const [description, setDescription] = useState('استوديو تصميم وكتابة عربية يصنع هويات هادئة وواضحة للعلامات الثقافية.');
  const [style, setStyle] = useState('Contemporary Arabic');
  const [transparent, setTransparent] = useState(true);
  const [generated, setGenerated] = useState(false);
  return <StudioShell active="logo">
    <section className="border-b border-white/[.06]">
      <div className="mx-auto grid max-w-[1180px] gap-8 px-5 pb-14 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
        <div><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#65f2c0]/20 bg-[#65f2c0]/[.06] px-3 py-1.5 text-[11px] text-[#65f2c0]"><Wand2 size={13}/> xfontat AI / logo studio</div><h1 className="text-4xl font-semibold leading-[1.08] tracking-[-.06em] sm:text-6xl">Give the name<br/><span className="text-[#65f2c0]">a shape.</span></h1><p className="xf-ar mt-5 max-w-md text-sm leading-7 text-[#84928c]" dir="rtl">اصنع اتجاهاً بصرياً أولياً لعلامتك العربية، ثم خذ الوقت لتختار الحروف التي تشبهها فعلاً.</p><div className="mt-7 flex gap-6 text-xs text-[#84928c]"><span><strong className="mr-1 text-[#dce8e1]">01</strong> Describe</span><span><strong className="mr-1 text-[#dce8e1]">02</strong> Direct</span><span><strong className="mr-1 text-[#dce8e1]">03</strong> Explore</span></div></div>
        <div className="xf-glass rounded-[25px] p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-medium"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#65f2c0]/15 text-[#65f2c0]">1</span> Tell us about the mark</div><span className="text-[10px] text-[#56645e]">ARABIC / SVG READY</span></div>
          <FieldLabel hint="Required">Brand name</FieldLabel><input value={brand} onChange={e=>setBrand(e.target.value)} dir="rtl" className="xf-ar mb-4 w-full rounded-xl border border-white/10 bg-[#0b1110] px-4 py-3.5 text-lg text-[#f0f5ef] outline-none focus:border-[#65f2c0]/60"/>
          <FieldLabel hint="A sentence is enough">What does it do?</FieldLabel><textarea value={description} onChange={e=>setDescription(e.target.value)} dir="rtl" className="xf-ar h-20 w-full resize-none rounded-xl border border-white/10 bg-[#0b1110] px-4 py-3 text-sm leading-7 text-[#dce8e1] outline-none focus:border-[#65f2c0]/60"/>
          <div className="mt-5 grid gap-4 sm:grid-cols-2"><SelectPill label="Letterform direction" options={['Contemporary Arabic','Kufi geometry','Naskh rhythm','Free exploration']}/><SelectPill label="Color direction" options={['Ink + mint','Sand + coral','Night + lilac','One color']}/></div>
          <div className="mt-5"><FieldLabel>Personality</FieldLabel><TagRow tags={['Quiet','Confident','Playful','Cultural'] } value={style} setValue={setStyle}/></div>
          <button onClick={()=>setTransparent(!transparent)} className="mt-5 flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#0b1110] px-3 py-3 text-left text-xs"><span className="flex items-center gap-2 text-[#dce8e1]"><Eraser size={15} className="text-[#65f2c0]"/> Transparent background</span><span className={`h-5 w-9 rounded-full p-1 transition ${transparent?'bg-[#65f2c0]':'bg-white/15'}`}><span className={`block h-3 w-3 rounded-full bg-[#08100e] transition ${transparent?'translate-x-4':''}`}/></span></button>
          <button onClick={()=>setGenerated(true)} className="xf-button xf-pulse mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#65f2c0] py-4 text-sm font-semibold text-[#07100d]"><Sparkles size={17}/>{generated?'Explore another direction':'Generate logo directions'}<ArrowRight size={16}/></button>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="mb-2 font-['DM_Mono'] text-[10px] uppercase tracking-[.2em] text-[#65f2c0]">Direction board / {brand}</p><h2 className="text-2xl font-medium tracking-[-.04em]">Three marks to react to.</h2></div><p className="max-w-xs text-xs leading-5 text-[#84928c] sm:text-right">These are visual directions, not a final wordmark. The Arabic text stays editable HTML.</p></div>
      <div className="grid gap-4 md:grid-cols-3">{variants.map((v,i)=><article key={v.id} className="xf-reveal group" style={{animationDelay:`${i*120}ms`}}><div className="relative aspect-[1.08] overflow-hidden rounded-2xl border border-white/10 bg-[#121918] p-5 transition group-hover:border-white/25"><div className="absolute inset-0 opacity-30" style={{backgroundImage:'radial-gradient(circle at 50% 40%, '+v.accent+'44, transparent 42%)'}}/><div className="relative flex h-full flex-col items-center justify-center"><div className={`mb-5 grid h-24 w-24 place-items-center border-2 text-6xl text-[#0d1513] ${v.shape}`} style={{backgroundColor:v.accent, borderColor:v.accent}}><span className="xf-ar">{v.mark}</span></div><div className="xf-ar text-3xl font-bold tracking-[-.05em]" dir="rtl">{brand}</div><div className="mt-3 h-px w-16 bg-white/15"/></div><span className="absolute left-4 top-4 font-['DM_Mono'] text-[10px] text-[#65736d]">{v.id} / 03</span><button aria-label={`Preview direction ${v.id}`} className="absolute right-4 top-4 rounded-full bg-white/[.07] p-2 text-[#84928c] opacity-0 transition group-hover:opacity-100"><MoveDiagonal size={14}/></button></div><div className="flex items-center justify-between px-1 pt-3 text-xs"><span className="text-[#84928c]">{v.label}</span><button className="flex items-center gap-1 text-[#dce8e1]"><Check size={13} className="text-[#65f2c0]"/> Select</button></div></article>)}</div>
      <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#65f2c0]/15 bg-[#65f2c0]/[.04] p-5 sm:flex-row sm:items-center sm:p-6"><div><p className="text-sm font-medium">Ready to take one further?</p><p className="mt-1 text-xs text-[#84928c]">Refine the chosen direction with a real xfontat typeface.</p></div><button className="flex items-center gap-2 rounded-xl bg-[#dceee3] px-4 py-3 text-xs font-semibold text-[#0b1512]"><Download size={14}/> Download direction board</button></div>
    </section>
  </StudioShell>
}