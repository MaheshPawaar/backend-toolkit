export const metadata = {
  title: "URL Encode & Decode Online — Free Browser Tool | BackendKit",
  description:
    "Encode and decode URL components instantly in your browser. Full Unicode support. No data sent to any server.",
  keywords: [
    "url encoder",
    "url decoder",
    "url encode online",
    "url decode online",
    "percent encoding",
    "url percent encoder",
    "url encode decode free",
    "query string encoder",
  ],
  alternates: {
    canonical: "https://backendkit.maheshpawar.me/tools/url-encoder",
  },
  openGraph: {
    title: "URL Encode & Decode Online — Free Browser Tool | BackendKit",
    description:
      "Encode and decode URL components instantly in your browser. Full Unicode support. No data sent to any server.",
  },
  twitter: {
    title: "URL Encode & Decode Online — Free Browser Tool | BackendKit",
    description:
      "Encode and decode URL components instantly in your browser. Full Unicode support. No data sent to any server.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "URL Encode & Decode",
  url: "https://backendkit.maheshpawar.me/tools/url-encoder",
  description:
    "Encode and decode URL components instantly in your browser. Full Unicode support. No data sent to any server.",
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
