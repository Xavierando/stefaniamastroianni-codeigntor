import { useEffect, useState } from "react";
import { Hero } from "@/components/ui/Hero";
import { EventCarousel } from "@/components/sections/EventCarousel";
import { ServiceOverview } from "@/components/sections/ServiceOverview";
import { MarqueeGallery } from "@/components/sections/MarqueeGallery";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { apiFetch } from "@/lib/api";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { PageIntroduction } from "@/components/sections/PageIntroduction";
import { SEO } from "@/components/common/SEO";
import { SITE_URL } from "@/config/site";

export function Home() {
  const [eventsData, setEventsData] = useState([]);
  const [reviewsData, setReviewsData] = useState([]);
  const [galleryData, setGalleryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [eventsRes, reviewsRes, galleryRes] = await Promise.all([
          apiFetch("/events?limit=6"),
          apiFetch("/reviews?limit=8"),
          apiFetch("/gallery?limit=10"),
        ]);

        // Format events data
        const formattedEvents = (eventsRes || []).map((e: any) => ({
          id: e.id,
          slug: e.slug || "",
          title: e.title,
          shortDescription: e.shortDescription,
          description: e.description,
          category: e.category,
          date: e.date
            ? new Date(e.date).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Da definire",
          location: e.location || "Studio Olistico Mastroianni",
          isFull: e.isFull,
          imageSrc: e.imageUrl || undefined,
        }));

        setEventsData(formattedEvents);
        setReviewsData(reviewsRes || []);
        setGalleryData(galleryRes || []);
      } catch (error) {
        console.error("Failed to load home data", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  const isHeroLoaded = useImagePreloader("/images/home/home-hero-yoga.webp");

  const isReady = !isLoading && isHeroLoaded;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: "Stefania Mastroianni",
    description:
      "Operatrice per la Salute e il Benessere - Yoga, Trattamenti, Accompagnamento alla nascita",
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ancona",
      addressRegion: "AN",
      addressCountry: "IT",
    },
    founder: {
      "@type": "Person",
      name: "Stefania Mastroianni",
    },
  };

  return (
    <>
      {!isReady && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-brand-base items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
      )}

      <SEO schema={localBusinessSchema} />

      <div
        className={`flex flex-col min-h-screen bg-brand-base transition-opacity duration-500 ${!isReady ? "opacity-0 h-screen overflow-hidden" : "opacity-100"}`}
      >
        {/* 1. Hero Section */}
        <Hero imageSrc="/images/home/home-hero-yoga.webp" imagePosition="top" />

        {/* 2. Introduzione (Chi è e Cosa Fa) */}
        <PageIntroduction
          as="h1"
          variant="editorial"
          showBorder
          title='"Ogni giorno il nostro corpo ci offre dei messaggi importanti, che ci indicano come stiamo e di cosa abbiamo bisogno"'
          description="Per tornare lì, all'origine, a quel linguaggio semplice e naturale di relazione tra corpo, mente e emozioni, abbiamo bisogno di uno spazio sicuro, in cui sentirci visti e ascoltati. Attraverso momenti di dialogo, esplorazione, ascolto, movimento, contatto, gioco e tanto altro, sono felice di accompagnarti nel tuo personale viaggio di ri-scoperta e trasformazione, come un'alleata che cresce e cambia con te."
          ctaText="Scopri di più su di me"
          ctaHref="/chi-sono"
        />

        {/* 3. Carosello Eventi */}
        <EventCarousel events={eventsData} className="bg-brand-base" />

        {/* 4. Panoramica Servizi */}
        <div className="flex flex-col w-full">
          <ServiceOverview
            title="Maternità"
            description="Un accompagnamento dolce dal preconcepimento al post-parto. Spazi di condivisione, preparazione corporea ed emotiva per vivere la nascita in pienezza."
            imageSrc="/images/home/Servizi-maternita-1.webp"
            href="/maternita"
            ctaText="Scopri i percorsi nascita"
            imagePosition="left"
            alternateBackground={false}
            alternateColorClass="bg-white"
            backgroundColorClass="bg-brand-base"
          />

          <ServiceOverview
            title="Trattamenti Olistici"
            description="Massaggi e tecniche manuali per sciogliere le tensioni profonde, riequilibrare il sistema nervoso e favorire il rilassamento rigenerante."
            imageSrc="/images/home/trattamenti-olistici-1.webp"
            href="/trattamenti"
            ctaText="Scopri i trattamenti"
            imagePosition="right"
            alternateBackground={true}
            alternateColorClass="bg-white"
            backgroundColorClass="bg-brand-base"
          />

          <ServiceOverview
            title="Yoga e Meditazione"
            description="Pratiche corporee, del respiro e di concentrazione per coltivare la presenza, flessibilità e forza, adattate per ogni livello di esperienza."
            imageSrc="/images/home/Pratiche-di-Yoga.webp"
            href="/yoga-e-meditazione"
            ctaText="Inizia a praticare"
            imagePosition="left"
            alternateBackground={false}
            alternateColorClass="bg-white"
            backgroundColorClass="bg-brand-base"
          />

          <ServiceOverview
            title="Consulenze e Percorsi"
            description="Percorsi individualizzati per attraversare momenti di passaggio, ritrovare la propria centratura e definire nuovi obiettivi di benessere."
            imageSrc="/images/home/consulenze-2.webp"
            href="/consulenze"
            ctaText="Richiedi una consulenza"
            imagePosition="right"
            alternateBackground={true}
            alternateColorClass="bg-white"
            backgroundColorClass="bg-brand-base"
          />
        </div>

        {/* 5. Recensioni */}
        <TestimonialsCarousel reviews={reviewsData} className="bg-brand-base" />

        {/* 6. Galleria "Marquee" */}
        <MarqueeGallery images={galleryData} className="bg-white" />
      </div>
    </>
  );
}
