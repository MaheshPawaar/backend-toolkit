export const metadata = {
  title: "Unix Timestamp Converter — Epoch to Date & Back | BackendKit",
  description:
    "Convert Unix timestamps to human-readable dates and back. Supports seconds and milliseconds, multiple timezones, and real-time clock. 100% client-side, no data sent to any server.",
  openGraph: {
    title: "Unix Timestamp Converter — Epoch to Date & Back | BackendKit",
    description:
      "Convert Unix timestamps to human-readable dates and back. Supports seconds and milliseconds, multiple timezones, and real-time clock.",
    images: [{ url: "/image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unix Timestamp Converter — Epoch to Date & Back | BackendKit",
    description:
      "Convert Unix timestamps to human-readable dates and back. Supports seconds and milliseconds, multiple timezones, and real-time clock.",
    images: ["/image.png"],
  },
  alternates: {
    canonical: "https://backendkit.maheshpawar.me/tools/timestamp",
  },
};

export default function Layout({ children }) {
  return children;
}
