export const metadata = {
  title: "Hash Generator — SHA-256, SHA-512, MD5 & More | BackendKit",
  description:
    "Generate SHA-256, SHA-384, SHA-512, SHA-1, and MD5 hashes instantly in your browser. No data sent to any server — 100% client-side and private.",
  openGraph: {
    title: "Hash Generator — SHA-256, SHA-512, MD5 & More | BackendKit",
    description:
      "Generate SHA-256, SHA-384, SHA-512, SHA-1, and MD5 hashes instantly in your browser. No data sent to any server.",
    images: [{ url: "/image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hash Generator — SHA-256, SHA-512, MD5 & More | BackendKit",
    description:
      "Generate SHA-256, SHA-384, SHA-512, SHA-1, and MD5 hashes instantly in your browser. No data sent to any server.",
    images: ["/image.png"],
  },
  alternates: {
    canonical: "https://backendkit.maheshpawar.me/tools/hash-generator",
  },
};

export default function Layout({ children }) {
  return children;
}
