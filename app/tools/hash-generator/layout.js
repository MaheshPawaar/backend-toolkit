export const metadata = {
  title: "Hash Generator — SHA-256, SHA-512, MD5 & More | BackendKit",
  description:
    "Generate SHA-256, SHA-384, SHA-512, SHA-1, and MD5 hashes instantly in your browser. No data sent to any server — 100% client-side and private.",
  keywords: [
    "sha256 generator",
    "md5 generator",
    "hash generator online",
    "sha512 generator",
    "sha1 generator",
    "crypto hash online",
    "generate sha256 online",
    "hash string online free",
  ],
  alternates: {
    canonical: "https://backendkit.maheshpawar.me/tools/hash-generator",
  },
  openGraph: {
    title: "Hash Generator — SHA-256, SHA-512, MD5 & More | BackendKit",
    description:
      "Generate SHA-256, SHA-384, SHA-512, SHA-1, and MD5 hashes instantly in your browser. No data sent to any server.",
  },
  twitter: {
    title: "Hash Generator — SHA-256, SHA-512, MD5 & More | BackendKit",
    description:
      "Generate SHA-256, SHA-384, SHA-512, SHA-1, and MD5 hashes instantly in your browser. No data sent to any server.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Hash Generator",
  url: "https://backendkit.maheshpawar.me/tools/hash-generator",
  description:
    "Generate SHA-256, SHA-384, SHA-512, SHA-1, and MD5 hashes instantly in your browser. No data sent to any server.",
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
