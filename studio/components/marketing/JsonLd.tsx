import { SITE } from "@/lib/marketing";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    description: SITE.description,
    url: SITE.url,
    offers: {
      "@type": "Offer",
      price: "0.60",
      priceCurrency: "USD",
      description: "Starting price per 5-second Seedance 2.0 video clip",
    },
    featureList: [
      "Text to Video",
      "Image to Video",
      "Reference Video",
      "Seedance 1.0 Pro Fast",
      "Seedance 1.5 Pro",
      "Seedance 2.0",
      "Seedance 2.0 Face",
      "REST API",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
