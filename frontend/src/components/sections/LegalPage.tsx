import type { ReactNode } from "react";
import { SEO } from "@/components/common/SEO";

// Impaginazione comune a Privacy e Cookie Policy. Il plugin typography di
// Tailwind non è installato, quindi spaziature e liste sono esplicite qui.

interface LegalPageProps {
  title: string;
  seoDescription: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPage({ title, seoDescription, lastUpdated, children }: LegalPageProps) {
  return (
    <>
      <SEO title={title} description={seoDescription} />
      <div className="flex flex-col min-h-screen bg-white">
        <div className="container mx-auto max-w-3xl py-32 px-4">
          <h1 className="font-serif text-4xl text-brand-primary mb-12">{title}</h1>
          <div className="text-brand-contrast/80 leading-relaxed space-y-4">
            {children}
            <p className="pt-8 text-sm opacity-60">Ultimo aggiornamento: {lastUpdated}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-serif text-2xl text-brand-primary pt-8">{title}</h2>
      {children}
    </section>
  );
}

export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="list-disc pl-6 space-y-2">{children}</ul>;
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-brand-secondary transition-colors"
    >
      {children}
    </a>
  );
}
