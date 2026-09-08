import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, ChevronDown, Download, Eraser, Grid3X3, Menu, Sparkles, Type, X } from 'lucide-react';
import './LogoMakerPurple.css';

const directions = [
  { id: '01', name: 'مدار الحرف', en: 'LETTER ORBIT', tone: 'ن', bg: '#c178ff', shape: 'rounded-[44%_56%_48%_52%]', detail: 'حركة دائرية / شخصية' },
  { id: '02', name: 'بنية نون', en: 'NOON STRUCTURE', tone: 'ن', bg: '#f3d8ff', shape: 'rounded-[18%_52%_18%_52%]', detail: 'هندسي / واثق' },
  { id: '03', name: 'أثر هادئ', en: 'QUIET TRACE', tone: 'ن', bg: '#7b42d5', shape: 'rounded-[52%_22%_52%_22%]', detail: 'ثقافي / معاصر' },
];

export function LogoMakerPurple() {
  const [brand, setBrand] = useState('استوديو نون');
  const [description, setDescription] = useState('استوديو تصميم وكتابة عربية يصنع هويات هادئة وواضحة للعلامات الثقافية.');
  const [letterform, setLetterform] = useState('هندسي');
  const [personality, setPersonality] = useState('واثق');
  const [transparent, setTransparent] = useState(true);
  const [generated, setGenerated] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const generate = () => {
    setGenerating(true);
    setGenerated(false);
    window.setTimeout(() => { setGenerating(false); setGenerated(true); }, 850);
  };
  const downloadBoard = () => {
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 1800);
  };

  return (
    <div className="violet-lab violet-noise">
      <header className="mx-auto flex max-w-[1380px] items-center justify-between px-5 py-5 sm:px-9">
        <div className="flex items-center gap-7">
          <a href="/__mockup/preview/xfontat-ai-tools/LogoMakerPurple" className="flex items-center gap-2 text-lg font-semibold tracking-[-.05em]">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#a45cff] text-[#100916]"><Type size={17} strokeWidth={2.5}/></span>
            <span>xfontat<span className="text-[#b875ff]">.</span></span>
          </a>
          <span className="hidden h-5 w-px bg-white/10 sm:block"/>
          <span className="hidden text-[11px] uppercase tracking-[.2em] text-[#a99eaf] sm:block">Identity lab / 03</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setMenu(!menu)} aria-label={menu ? 'Close menu' : 'Open menu'} className="rounded-lg p-2 text-[#a99eaf] sm:hidden">{menu ? <X size={18}/> : <Menu size={18}/>}</button>
          <button className="hidden text-xs text-[#b4abbc] transition hover:text-white sm:block">دخول</button>
          <button onClick={() => setMenu(!menu)} className="violet-button rounded-full border border-[#a45cff]/45 bg-[#a45cff]/10 px-4 py-2.5 text-xs font-medium text-[#ca98ff]">افتح xfontat</button>
        </div>
      </header>
      {menu && <div className="mx-5 mb-4 rounded-2xl border border-[#a45cff]/25 bg-[#150e1c] p-4 text-right text-sm text-[#ded5e7] sm:hidden"><p className="violet-ar">استوديو الهوية العربية</p><p className="mt-2 text-xs text-[#9c95a7]">صمّم، جرّب، ثم خذ الحرف إلى مكانه.</p></div>}

      <main>
        <section className="violet-grid border-y border-white/[.07]">
          <div className="mx-auto grid max-w-[1380px] gap-10 px-5 py-10 sm:px-9 sm:py-16 lg:grid-cols-[1fr_1.08fr] lg:items-center lg:gap-16">
            <div className="violet-rise">
              <div className="mb-6 flex items-center gap-2 text-[10px] uppercase tracking-[.24em] text-[#bc78ff]"><span className="h-1.5 w-1.5 rounded-full bg-[#bc78ff]"/> Arabic identity / studio 03</div>
              <h1 className="violet-ar max-w-[650px] text-right text-[clamp(2.7rem,6vw,6.3rem)] font-semibold leading-[1.07] tracking-[-.065em]" dir="rtl">امنح الحرف<br/><span className="text-[#a85cff]">هويةً تُرى.</span></h1>
              <p className="violet-ar mt-6 max-w-[530px] text-right text-base leading-8 text-[#afa6b7]" dir="rtl">لا نبحث عن شعار جميل فقط. نبحث عن نبرة، إيقاع، وعلامة تستطيع أن تحمل اسمك العربي إلى العالم.</p>
              <div className="mt-8 flex items-center justify-end gap-5 text-[11px] text-[#817789]">
                <span>اكتب <b className="ml-1 text-[#e8dff0]">01</b></span><span className="h-px w-8 bg-[#6e477f]"/><span>وجّه <b className="ml-1 text-[#e8dff0]">02</b></span><span className="h-px w-8 bg-[#6e477f]"/><span>اختر <b className="ml-1 text-[#e8dff0]">03</b></span>
              </div>
            </div>

            <section className="violet-panel rounded-[28px] p-5 sm:p-7" aria-label="Logo creation brief">
              <div className="mb-7 flex items-center justify-between border-b border-white/[.08] pb-5">
                <div className="flex items-center gap-2 text-xs font-medium"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#a45cff]/20 text-[#c78cff]">01</span> <span>بداية الهوية</span></div>
                <span className="font-['DM_Mono'] text-[9px] tracking-[.18em] text-[#796d82]">AR / EDITABLE</span>
              </div>
              <label className="mb-2 block text-right text-[11px] uppercase tracking-[.14em] text-[#9c95a7]" htmlFor="brand">اسم العلامة <span className="text-[#b875ff]">*</span></label>
              <input id="brand" value={brand} onChange={e => setBrand(e.target.value)} dir="rtl" className="violet-field violet-ar mb-5 w-full rounded-xl px-4 py-3.5 text-xl text-[#f6effa]"/>
              <label className="mb-2 block text-right text-[11px] uppercase tracking-[.14em] text-[#9c95a7]" htmlFor="description">ماذا تصنع؟ <span className="normal-case tracking-normal text-[#685d70]">سطر واحد يكفي</span></label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} dir="rtl" className="violet-field violet-ar h-24 w-full resize-none rounded-xl px-4 py-3 text-sm leading-7 text-[#ddd3e2]"/>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div><label className="mb-2 block text-right text-[11px] uppercase tracking-[.14em] text-[#9c95a7]" htmlFor="letterform">منطق الحرف</label><div className="relative"><select id="letterform" value={letterform} onChange={e=>setLetterform(e.target.value)} className="violet-field violet-ar w-full appearance-none rounded-xl px-3 py-3 text-right text-sm text-[#eee4f2]"><option>هندسي</option><option>نسخي</option><option>حر وتجريبي</option><option>كوفي معاصر</option></select><ChevronDown className="pointer-events-none absolute left-3 top-3.5 text-[#a45cff]" size={15}/></div></div>
                <div><span className="mb-2 block text-right text-[11px] uppercase tracking-[.14em] text-[#9c95a7]">شخصية العلامة</span><div className="flex gap-2" dir="rtl">{['واثق','هادئ','جريء'].map(tag=><button type="button" key={tag} onClick={()=>setPersonality(tag)} className={`violet-ar rounded-xl border px-3 py-3 text-xs transition ${personality===tag?'border-[#a45cff] bg-[#a45cff]/15 text-[#d5a8ff]':'border-white/10 bg-[#0d0a12] text-[#978d9e]'}`}>{tag}</button>)}</div></div>
              </div>
              <button type="button" onClick={()=>setTransparent(!transparent)} className="mt-5 flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#0d0a12] px-3.5 py-3 text-right text-xs">
                <span className="flex items-center gap-2 text-[#ddd3e2]"><Eraser size={15} className="text-[#bc78ff]"/>خلفية شفافة / SVG-ready</span>
                <span className={`h-5 w-9 rounded-full p-1 transition ${transparent?'bg-[#a45cff]':'bg-white/15'}`}><span className={`block h-3 w-3 rounded-full bg-[#110a16] transition ${transparent?'translate-x-4':''}`}/></span>
              </button>
              <button type="button" onClick={generate} disabled={generating} className="violet-button violet-pulse mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#a45cff] py-4 text-sm font-semibold text-[#13091b] disabled:opacity-70">
                <Sparkles size={17}/>{generating ? 'نشكّل الحروف الآن…' : generated ? 'ولّد اتجاهات جديدة' : 'تشكيل هوية العلامة'}<ArrowLeft size={16}/>
              </button>
            </section>
          </div>
        </section>

        <section className="mx-auto max-w-[1380px] px-5 py-12 sm:px-9 sm:py-16">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="text-right sm:order-2"><p className="mb-2 font-['DM_Mono'] text-[10px] uppercase tracking-[.22em] text-[#b875ff]">Direction board / {brand}</p><h2 className="violet-ar text-3xl font-semibold tracking-[-.05em]" dir="rtl">ثلاث نبرات لاسم واحد.</h2><p className="violet-ar mt-2 text-sm text-[#958a9e]" dir="rtl">اختر الإحساس قبل أن تختار الشكل.</p></div>
            <div className="flex items-center gap-2 text-xs text-[#84788c] sm:order-1"><Grid3X3 size={15} className="text-[#a45cff]"/><span>الحروف عربية وقابلة للتحرير</span></div>
          </div>
          {!generated ? <div className="grid gap-4 md:grid-cols-3">{directions.map(v=><div key={v.id} className="violet-panel violet-shimmer aspect-[1.08] rounded-2xl"/> )}</div> :
          <div className="grid gap-5 md:grid-cols-3">{directions.map((v,i)=><article key={v.id} className="violet-rise group" style={{animationDelay:`${i*120}ms`}}><div className={`relative aspect-[1.06] overflow-hidden rounded-[24px] border transition ${selected===v.id?'border-[#bc78ff] ring-2 ring-[#a45cff]/20':'border-white/10'} bg-[#130e19] p-5`}><div className="absolute inset-0 opacity-40" style={{backgroundImage:`radial-gradient(circle at 50% 42%, ${v.bg}55, transparent 45%)`}}/><span className="absolute left-5 top-5 font-['DM_Mono'] text-[10px] text-[#806e8e]">{v.id} / 03</span><button onClick={()=>setSelected(v.id)} className="absolute right-5 top-5 rounded-full bg-white/[.07] p-2 text-[#c1a9cb] transition hover:bg-[#a45cff]/25" aria-label={`Select ${v.name}`}><Check size={14}/></button><div className="relative flex h-full flex-col items-center justify-center"><div className={`mb-5 grid h-24 w-24 place-items-center border text-6xl text-[#170d1c] ${v.shape}`} style={{backgroundColor:v.bg,borderColor:v.bg}}><span className="violet-ar">{v.tone}</span></div><div className="violet-ar text-3xl font-bold tracking-[-.06em]" dir="rtl">{brand}</div><div className="mt-3 font-['DM_Mono'] text-[9px] tracking-[.18em] text-[#a792ae]">{v.en}</div></div><span className="absolute bottom-4 left-5 text-[10px] text-[#897b91]">{v.detail}</span></div><div className="flex items-center justify-between px-1 pt-3 text-right text-xs"><span className="violet-ar text-[#d8cde0]">{v.name}</span><button onClick={()=>setSelected(v.id)} className={`flex items-center gap-1 ${selected===v.id?'text-[#c78cff]':'text-[#978c9e]'}`}><Check size={13}/>{selected===v.id?'تم الاختيار':'اختر'}</button></div></article>)}</div>}
          <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-[22px] border border-[#a45cff]/20 bg-[#a45cff]/[.06] p-5 sm:flex-row sm:items-center sm:p-6"><div className="text-right"><p className="violet-ar text-sm font-medium">جاهز لأخذ أحد الاتجاهات إلى الأمام؟</p><p className="violet-ar mt-1 text-xs text-[#a99bad]">احفظ لوحة الاتجاهات وشاركها مع فريقك.</p></div><button onClick={downloadBoard} className="violet-button flex items-center gap-2 rounded-xl bg-[#eee4f5] px-4 py-3 text-xs font-semibold text-[#170c1d]"><Download size={14}/>{downloaded?'تم حفظ اللوحة':'تحميل لوحة الاتجاهات'}</button></div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-[1380px] items-center justify-between px-5 pb-7 pt-2 text-[11px] text-[#75687d] sm:px-9"><span>Arabic type, made visible.</span><span className="flex items-center gap-1">xfontat AI lab <ArrowUpRight size={12}/></span></footer>
    </div>
  );
}