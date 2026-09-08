import { Check, ChevronDown, Link as LinkIcon, Upload, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { FieldLabel } from './StudioShell';

export function SelectPill({ label, options }: { label: string; options: string[] }) {
  const [value, setValue] = useState(options[0]);
  return <label className="flex min-w-0 flex-1 flex-col gap-2"><FieldLabel>{label}</FieldLabel><div className="relative"><select value={value} onChange={e=>setValue(e.target.value)} className="w-full appearance-none rounded-xl border border-white/10 bg-[#0c1211] px-3 py-3 text-sm text-[#e9f2ec] outline-none focus:border-[#65f2c0]/60">{options.map(o=><option key={o}>{o}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-3.5 text-[#84928c]"/></div></label>
}
export function UploadLinkBox() {
  const [mode, setMode] = useState<'upload'|'link'>('upload');
  return <div className="rounded-2xl border border-dashed border-white/15 bg-black/10 p-1">
    <div className="flex gap-1 p-1">
      <button onClick={()=>setMode('upload')} className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs ${mode==='upload'?'bg-[#65f2c0]/10 text-[#65f2c0]':'text-[#84928c]'}`}><Upload size={14}/> Upload reference</button>
      <button onClick={()=>setMode('link')} className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs ${mode==='link'?'bg-[#65f2c0]/10 text-[#65f2c0]':'text-[#84928c]'}`}><LinkIcon size={14}/> Paste a link</button>
    </div>
    {mode==='upload' ? <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs text-[#84928c] transition hover:bg-white/[.04]"><ImageIcon size={16} className="text-[#65f2c0]"/><span><strong className="block font-medium text-[#dce8e1]">Bring a visual reference</strong> JPG, PNG or a YouTube thumbnail</span></button> : <input className="w-full rounded-xl bg-transparent px-3 py-3 text-xs text-white outline-none placeholder:text-[#55635d]" placeholder="https://youtube.com/watch?v=..." />}
  </div>
}
export function TagRow({ tags, value, setValue }: { tags: string[]; value: string; setValue: (v:string)=>void }) {
  return <div className="flex flex-wrap gap-2">{tags.map(tag=><button key={tag} onClick={()=>setValue(tag)} className={`rounded-full border px-3 py-2 text-xs transition ${value===tag?'border-[#65f2c0]/60 bg-[#65f2c0]/10 text-[#65f2c0]':'border-white/10 text-[#84928c] hover:border-white/25'}`}>{value===tag && <Check size={12} className="mr-1 inline"/>}{tag}</button>)}</div>
}