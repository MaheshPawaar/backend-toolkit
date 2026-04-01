export const metadata = {
  title: "Convert JSON to CSV Online — Free, No Upload | BackendKit",
  description:
    "Convert JSON arrays to CSV instantly in your browser. Paste or upload a file — handles large datasets without freezing. No data sent to any server.",
  keywords: [
    "json to csv",
    "convert json to csv",
    "json csv converter",
    "json array to csv",
    "json to csv online free",
    "json to spreadsheet",
    "json export csv",
  ],
  alternates: {
    canonical: "https://backendkit.maheshpawar.me/tools/json-csv",
  },
  openGraph: {
    title: "Convert JSON to CSV Online — Free, No Upload | BackendKit",
    description:
      "Convert JSON arrays to CSV instantly in your browser. Paste or upload a file — handles large datasets without freezing.",
  },
  twitter: {
    title: "Convert JSON to CSV Online — Free, No Upload | BackendKit",
    description:
      "Convert JSON arrays to CSV instantly in your browser. Paste or upload a file — handles large datasets without freezing.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JSON to CSV Converter",
  url: "https://backendkit.maheshpawar.me/tools/json-csv",
  description:
    "Convert JSON arrays to CSV instantly in your browser. Handles large datasets without freezing. No data sent to any server.",
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
