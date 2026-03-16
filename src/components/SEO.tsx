import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  type?: string;
  image?: string;
  imageAlt?: string;
}

const SEO = ({
  title,
  description,
  url = "https://avalanchecomparison.lovable.app",
  type = "website",
  image = "https://storage.googleapis.com/gpt-engineer-file-uploads/4OLmNyz2gjf8FTMxhSBej9f0Je62/social-images/social-1773630258363-Screenshot_2026-03-15_18-40-38.webp",
  imageAlt = "Alaska Avalanche Summary dashboard",
}: SEOProps) => {
  const fullTitle = title.includes("Alaska Avalanche")
    ? title
    : `${title} | Alaska Avalanche Summary`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Alaska Avalanche Summary" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
