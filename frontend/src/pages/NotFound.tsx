import { Link } from "react-router-dom";
import { SEO } from "@/components/common/SEO";

export function NotFound() {
  return (
    <>
      <SEO title="Pagina non trovata" noindex />
      <section className="min-h-[70vh] flex flex-col items-center justify-center bg-brand-base text-brand-contrast px-6 text-center">
        <p className="font-serif text-6xl md:text-7xl mb-4 text-brand-primary">404</p>
        <h1 className="font-serif text-2xl md:text-3xl mb-4">Pagina non trovata</h1>
        <p className="max-w-md mb-8 text-brand-contrast/80">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <Link
          to="/"
          className="bg-brand-primary text-white hover:bg-brand-primary/90 transition-all px-8 py-3 rounded-full font-medium"
        >
          Torna alla home
        </Link>
      </section>
    </>
  );
}
