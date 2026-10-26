import { Link } from "wouter";
import { Gift, ImageDown, Keyboard, PenTool, Quote, Sparkles, UserRound, type LucideIcon } from "lucide-react";

export type ToolIcon = "keyboard" | "names" | "generator" | "tattoo" | "phrases" | "cards" | "zakhrafa";

const ICONS: Record<ToolIcon, LucideIcon> = {
  keyboard: Keyboard,
  names: UserRound,
  generator: ImageDown,
  tattoo: PenTool,
  phrases: Quote,
  cards: Gift,
  zakhrafa: Sparkles,
};

export type ToolTile = { href: string; icon: ToolIcon; title: string; text: string };

// Free tools on the home pages, the same in every language: a scrollable row
// of small icon tiles on phones, so the font list stays near the top, and
// cards with a description from md up.
export function ToolTiles({ tools, heading }: { tools: ToolTile[]; heading?: string }) {
  return (
    <section className="mt-4" aria-label={heading}>
      {heading && <h2 className="mb-3 hidden text-xl font-semibold md:block">{heading}</h2>}
      <ul
        className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 md:mx-0 md:grid md:gap-3 md:overflow-visible md:px-0"
        style={{ gridTemplateColumns: `repeat(${tools.length}, minmax(0, 1fr))` }}
      >
        {tools.map((tool) => {
          const Icon = ICONS[tool.icon];
          return (
            <li key={tool.href} className="w-[104px] shrink-0 md:w-auto">
              <Link
                href={tool.href}
                className="group flex h-full flex-col items-center gap-2 rounded-lg border bg-card p-3 text-center transition-colors hover:border-primary md:flex-row md:items-start md:gap-3 md:p-4 md:text-start"
                data-testid={`card-tool-${tool.icon}`}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold leading-snug transition-colors group-hover:text-primary md:text-base">{tool.title}</span>
                  <span className="mt-1 hidden text-sm leading-relaxed text-muted-foreground md:block">{tool.text}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
