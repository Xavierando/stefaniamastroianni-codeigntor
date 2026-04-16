import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Calendar, ArrowRight } from "lucide-react";
import { Hero } from "@/components/ui/Hero";
import { useImagePreloader } from "@/hooks/useImagePreloader";

export function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        const data = await apiFetch("/posts");
        setPosts(data || []);
      } catch (err: any) {
        console.error("Failed to fetch posts:", err);
        setError("Errore nel caricamento degli articoli del blog.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const isHeroLoaded = useImagePreloader("/images/home/slidehome1.webp");

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
        <Hero
          imageSrc="/images/home/slidehome1.webp"
          
          imagePosition="top"
        />

        <section className="py-16 md:py-24 px-4 bg-brand-base">
          <div className="container mx-auto max-w-4xl text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-contrast mb-6">
              Il Blog di Stefania
            </h1>
            <p className="text-xl text-brand-contrast/80 leading-relaxed font-light mb-12">
              Riflessioni, approfondimenti e consigli sul benessere olistico, la
              maternità e la crescita personale.
            </p>
          </div>
        </section>
        <section className="py-24 px-4 bg-brand-base overflow-hidden relative">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-brand-primary text-xl">
                {error}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-white/50 rounded-2xl border border-brand-primary/10">
                <h3 className="text-2xl font-serif text-brand-primary mb-4">
                  Nessun articolo pubblicato
                </h3>
                <p className="text-brand-contrast/70">
                  Trona presto per leggere nuovi contenuti.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-[2rem] overflow-hidden shadow-none border-0 hover:shadow-soft transition-all duration-500 group flex flex-col h-full"
                  >
                    <Link
                      to={`/blog/${post.slug || post.id}`}
                      className="block relative aspect-[4/3] overflow-hidden bg-brand-primary/5"
                    >
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-primary/20">
                          <span className="font-serif text-xl">
                            Stefania Mastroianni
                          </span>
                        </div>
                      )}
                    </Link>

                    <div className="p-8 flex flex-col flex-grow">
                      {post.date && (
                        <div className="flex items-center text-sm font-medium text-brand-contrast/50 uppercase tracking-wider mb-4">
                          <Calendar size={14} className="mr-2" />
                          {new Date(post.date).toLocaleDateString("it-IT", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                      )}

                      <h3 className="text-xl md:text-2xl font-serif text-brand-primary mb-4 line-clamp-2">
                        <Link
                          to={`/blog/${post.slug || post.id}`}
                          className="hover:text-brand-secondary transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-brand-contrast/70 line-clamp-3 mb-6 flex-grow">
                        {/* Generiamo un breve estratto se possibile, omettendo la sintassi markdown complessa */}
                        {post.content
                          ? post.content
                              .replace(/[#*_>]/g, "")
                              .substring(0, 150) + "..."
                          : ""}
                      </p>

                      <Link
                        to={`/blog/${post.slug || post.id}`}
                        className="inline-block mt-auto"
                      >
                        <Button
                          variant="outline"
                          className="w-full group-hover:bg-brand-primary group-hover:text-white transition-colors flex items-center justify-center"
                        >
                          Leggi l'articolo
                          <ArrowRight
                            size={16}
                            className="ml-2 group-hover:translate-x-1 transition-transform"
                          />
                        </Button>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
