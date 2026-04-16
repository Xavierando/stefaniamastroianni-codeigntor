import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Hero } from "@/components/ui/Hero";
import { EventCarousel } from "@/components/sections/EventCarousel";
import { ServiceOverview } from "@/components/sections/ServiceOverview";
import { MarqueeGallery } from "@/components/sections/MarqueeGallery";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { apiFetch } from "@/lib/api";
import { useImagePreloader } from "@/hooks/useImagePreloader";

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

  return (
    <>
      {!isReady && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-brand-base items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
      )}

      <div
        className={`flex flex-col min-h-screen bg-brand-base transition-opacity duration-500 ${!isReady ? "opacity-0 h-screen overflow-hidden" : "opacity-100"}`}
      >
        {/* 1. Hero Section */}
        <Hero
          imageSrc="/images/home/home-hero-yoga.webp"
          
          imagePosition="top"
        />

        {/* 2. Introduzione (Chi è e Cosa Fa) */}
        <section className="w-full py-24 px-4 bg-brand-base text-center border-b border-brand-contrast/5">
          <div className="container mx-auto max-w-4xl flex flex-col items-center">
            <h2 className="font-serif text-3xl md:text-5xl text-brand-contrast mb-8 leading-tight">
              "Credo in un approccio olistico che abbraccia corpo, mente ed emozioni."
            </h2>
            <p className="text-lg md:text-xl text-brand-contrast/80 leading-relaxed font-light mb-12">
              Ogni persona è unica e merita un ascolto profondo. Attraverso lo
              yoga, i trattamenti e uno spazio di ascolto autentico, ti
              accompagno nel tuo personale viaggio di trasformazione. Che tu
              stia cercando sollievo dallo stress, accompagnamento in gravidanza
              o semplicemente uno spazio per te.
            </p>
            <Link
              to="/chi-sono"
              className="inline-flex items-center justify-center rounded-full font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary bg-brand-primary text-white hover:bg-brand-primary/90 h-14 px-10 text-lg shadow-sm"
            >
              Scopri di più su di me
            </Link>
          </div>
        </section>

        {/* 3. Carosello Eventi */}
        <EventCarousel events={eventsData} className="bg-brand-base" />

        {/* 4. Panoramica Servizi */}
        <div className="flex flex-col w-full">
          <ServiceOverview
            title="Maternità Consapevole"
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
