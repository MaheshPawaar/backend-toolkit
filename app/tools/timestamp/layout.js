export const metadata = {
  title: "Unix Timestamp Converter — Epoch to Date & Back | BackendKit",
  description:
    "Convert Unix timestamps to human-readable dates and back. Supports seconds and milliseconds, multiple timezones, and real-time clock. 100% client-side, no data sent to any server.",
  keywords: [
    "unix timestamp converter",
    "epoch converter",
    "timestamp to date",
    "date to timestamp",
    "epoch time converter",
    "unix time converter online",
    "epoch to human readable",
  ],
  alternates: {
    canonical: "https://backendkit.maheshpawar.me/tools/timestamp",
  },
  openGraph: {
    title: "Unix Timestamp Converter — Epoch to Date & Back | BackendKit",
    description:
      "Convert Unix timestamps to human-readable dates and back. Supports seconds and milliseconds, multiple timezones, and real-time clock.",
  },
  twitter: {
    title: "Unix Timestamp Converter — Epoch to Date & Back | BackendKit",
    description:
      "Convert Unix timestamps to human-readable dates and back. Supports seconds and milliseconds, multiple timezones, and real-time clock.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Unix Timestamp Converter",
  url: "https://backendkit.maheshpawar.me/tools/timestamp",
  description:
    "Convert Unix timestamps to human-readable dates and back. Supports seconds, milliseconds, and multiple timezones.",
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
