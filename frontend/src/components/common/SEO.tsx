import { Helmet } from "react-helmet-async";
import { SITE_URL } from "@/config/site";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  schema?: object;
}

export function SEO({
  title,
  description,
  image = "/images/og-image-default.webp", // Default image if none provided
  url = SITE_URL,
  type = "website",
  schema,
}: SEOProps) {
  const siteName = "Stefania Mastroianni";
  const defaultTitle = `${siteName} | Yoga, Maternità e Trattamenti benessere ad Aosta`;
  const fullTitle = title
    ? title.includes(siteName)
      ? title
      : `${title} | ${siteName}`
    : defaultTitle;
  const siteDescription =
    description ||
    "Stefania Mastroianni - Percorsi olistici di benessere, yoga e accompagnamento alla maternità ad Aosta.";

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={siteDescription} />
      <link rel="canonical" href={window.location.href} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta
        property="og:image"
        content={image.startsWith("http") ? image : `${url}${image}`}
      />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta
        name="twitter:image"
        content={image.startsWith("http") ? image : `${url}${image}`}
      />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
