export const metadata = {
  title: "JSON Formatter & Validator Online — Free, No Server | BackendKit",
  description:
    "Format, minify and validate JSON instantly in your browser. No data leaves your machine. Supports 2-space, 4-space and tab indentation.",
  keywords: [
    "json formatter",
    "json validator",
    "json beautifier",
    "format json online",
    "json minifier",
    "pretty print json",
    "json lint",
    "json formatter online free",
  ],
  alternates: {
    canonical: "https://backendkit.maheshpawar.me/tools/json-formatter",
  },
  openGraph: {
    title: "JSON Formatter & Validator Online — Free, No Server | BackendKit",
    description:
      "Format, minify and validate JSON instantly in your browser. No data leaves your machine.",
  },
  twitter: {
    title: "JSON Formatter & Validator Online — Free, No Server | BackendKit",
    description:
      "Format, minify and validate JSON instantly in your browser. No data leaves your machine.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JSON Formatter & Validator",
  url: "https://backendkit.maheshpawar.me/tools/json-formatter",
  description:
    "Format, minify and validate JSON instantly in your browser. No data leaves your machine.",
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
