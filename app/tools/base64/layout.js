export const metadata = {
  title: "Base64 Encode & Decode Online — Free Browser Tool | BackendKit",
  description:
    "Encode and decode Base64 strings instantly in your browser. Full Unicode support. No data sent to any server.",
  keywords: [
    "base64 encoder",
    "base64 decoder",
    "base64 encode online",
    "base64 decode online",
    "base64 converter",
    "base64 string encoder",
    "base64 online free",
  ],
  alternates: {
    canonical: "https://backendkit.maheshpawar.me/tools/base64",
  },
  openGraph: {
    title: "Base64 Encode & Decode Online — Free Browser Tool | BackendKit",
    description:
      "Encode and decode Base64 strings instantly in your browser. Full Unicode support. No data sent to any server.",
  },
  twitter: {
    title: "Base64 Encode & Decode Online — Free Browser Tool | BackendKit",
    description:
      "Encode and decode Base64 strings instantly in your browser. Full Unicode support. No data sent to any server.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Base64 Encode & Decode",
  url: "https://backendkit.maheshpawar.me/tools/base64",
  description:
    "Encode and decode Base64 strings instantly in your browser. Full Unicode support. No data sent to any server.",
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
