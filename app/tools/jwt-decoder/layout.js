export const metadata = {
  title: "JWT Decoder Online — Decode Tokens & Inspect Claims | BackendKit",
  description:
    "Decode JWT tokens instantly in your browser. Inspect header, payload, expiry and claims. No token ever leaves your machine.",
  keywords: [
    "jwt decoder",
    "jwt parser",
    "json web token decoder",
    "decode jwt online",
    "jwt inspector",
    "jwt claims viewer",
    "jwt token decoder free",
  ],
  alternates: {
    canonical: "https://backendkit.maheshpawar.me/tools/jwt-decoder",
  },
  openGraph: {
    title: "JWT Decoder Online — Decode Tokens & Inspect Claims | BackendKit",
    description:
      "Decode JWT tokens instantly in your browser. Inspect header, payload, expiry and claims. No token ever leaves your machine.",
  },
  twitter: {
    title: "JWT Decoder Online — Decode Tokens & Inspect Claims | BackendKit",
    description:
      "Decode JWT tokens instantly in your browser. Inspect header, payload, expiry and claims. No token ever leaves your machine.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JWT Decoder",
  url: "https://backendkit.maheshpawar.me/tools/jwt-decoder",
  description:
    "Decode JWT tokens instantly in your browser. Inspect header, payload, expiry and claims. No token ever leaves your machine.",
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
