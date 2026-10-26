import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LocalizedMobileMenu } from "@/components/LocalizedMobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { intlNav, type IntlLocale } from "@/lib/intlTools";

const LANGUAGE_LABELS: Record<IntlLocale, string> = { en: "EN", fr: "FR", ar: "العربية" };

// Header and footer for the English and French tool pages. `languages` holds
// this page's path in each language it exists in.
export function IntlShell({
  locale,
  languages,
  children,
}: {
  locale: "en" | "fr";
  languages: Partial<Record<IntlLocale, string>>;
  children: ReactNode;
}) {
  const [location] = useLocation();
  const nav = intlNav[locale];
  const isActive = (href: string) => location === href || (href.length > 3 && location.startsWith(`${href}/`));
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground" dir="ltr">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-3 px-3 py-3 md:px-4">
          <div className="flex items-center gap-1">
            <LocalizedMobileMenu locale={locale} links={nav.map(({ href, label }) => ({ href, label }))} />
            <Link href={`/${locale}`} className="flex shrink-0 items-center hover:opacity-80" aria-label={`xfontat ${locale} home`}>
              <img src="/logo.png" alt="xfontat" className="h-8 w-auto md:h-10" />
            </Link>
          </div>
          <nav className="hidden items-center gap-4 text-sm lg:flex" aria-label={locale === "fr" ? "Navigation principale" : "Main navigation"}>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={isActive(item.href) ? "font-semibold" : "text-muted-foreground hover:text-foreground"}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-sm">
            {(Object.entries(languages) as Array<[IntlLocale, string]>)
              .filter(([lang]) => lang !== locale)
              .map(([lang, href]) => (
                <a key={lang} href={href} hrefLang={lang} className="rounded-md border px-2 py-2 hover:bg-muted">
                  {LANGUAGE_LABELS[lang]}
                </a>
              ))}
            <ThemeToggle label={locale === "fr" ? "Changer le thème" : "Toggle theme"} />
          </div>
        </div>
      </header>
      <main className="container mx-auto flex-1 px-4 py-8 md:py-10">{children}</main>
      <footer className="mt-12 border-t">
        <div className="container mx-auto grid gap-6 px-4 py-8 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-bold">xfontat</p>
            <p className="mt-2 text-muted-foreground">
              {locale === "fr"
                ? "Bibliothèque gratuite de polices arabes et d'outils d'écriture arabe."
                : "A free library of Arabic fonts and Arabic writing tools."}
            </p>
          </div>
          <ul className="space-y-2">
            {nav.slice(0, 4).map((item) => (
              <li key={item.href}><Link href={item.href} className="text-muted-foreground hover:text-foreground">{item.label}</Link></li>
            ))}
          </ul>
          <ul className="space-y-2">
            {nav.slice(4).map((item) => (
              <li key={item.href}><Link href={item.href} className="text-muted-foreground hover:text-foreground">{item.label}</Link></li>
            ))}
          </ul>
          <ul className="space-y-2">
            <li><Link href={`/${locale}/about`} className="text-muted-foreground hover:text-foreground">{locale === "fr" ? "À propos" : "About"}</Link></li>
            <li><Link href={`/${locale}/privacy`} className="text-muted-foreground hover:text-foreground">{locale === "fr" ? "Confidentialité" : "Privacy"}</Link></li>
            <li><Link href={`/${locale}/terms`} className="text-muted-foreground hover:text-foreground">{locale === "fr" ? "Conditions" : "Terms"}</Link></li>
            <li><Link href={`/${locale}/contact`} className="text-muted-foreground hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <p className="border-t py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} xfontat</p>
      </footer>
    </div>
  );
}

export function SectionList({ sections }: { sections: Array<{ heading: string; body: string }> }) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className="mb-3 text-2xl font-semibold">{section.heading}</h2>
          <p className="leading-relaxed text-muted-foreground">{section.body}</p>
        </section>
      ))}
    </div>
  );
}

export function FaqList({ heading, faqs }: { heading: string; faqs: Array<{ question: string; answer: string }> }) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">{heading}</h2>
      <div className="space-y-5">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h3 className="mb-1 font-semibold">{faq.question}</h3>
            <p className="leading-relaxed text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
