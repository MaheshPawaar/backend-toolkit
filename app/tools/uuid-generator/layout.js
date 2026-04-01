export const metadata = {
  title: "UUID Generator Online — v4 & v7, Crypto-Secure | BackendKit",
  description:
    "Generate UUID v4 (random) and v7 (timestamp-sortable) identifiers instantly. Powered by Web Crypto API. Bulk generation up to 50 at a time.",
  keywords: [
    "uuid generator",
    "uuid v4 generator",
    "uuid v7 generator",
    "ulid generator",
    "generate uuid online",
    "random uuid",
    "unique id generator",
    "guid generator online",
  ],
  alternates: {
    canonical: "https://backendkit.maheshpawar.me/tools/uuid-generator",
  },
  openGraph: {
    title: "UUID Generator Online — v4 & v7, Crypto-Secure | BackendKit",
    description:
      "Generate UUID v4 (random) and v7 (timestamp-sortable) identifiers instantly. Powered by Web Crypto API. Bulk generation up to 50 at a time.",
  },
  twitter: {
    title: "UUID Generator Online — v4 & v7, Crypto-Secure | BackendKit",
    description:
      "Generate UUID v4 (random) and v7 (timestamp-sortable) identifiers instantly. Powered by Web Crypto API. Bulk generation up to 50 at a time.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "UUID Generator",
  url: "https://backendkit.maheshpawar.me/tools/uuid-generator",
  description:
    "Generate UUID v4 (random) and v7 (timestamp-sortable) identifiers instantly. Powered by Web Crypto API.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  provider: {
    "@type": "Person",
    name: "Mahesh Pawar",
    url: "https://maheshpawar.me",
  },
};

export default function Layout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
