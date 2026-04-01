export const metadata = {
  title: "UUID Generator Online — v4 & v7, Crypto-Secure | BackendKit",
  description:
    "Generate UUID v4 (random) and v7 (timestamp-sortable) identifiers instantly. Powered by Web Crypto API. Bulk generation up to 50 at a time.",
  openGraph: {
    title: "UUID Generator Online — v4 & v7, Crypto-Secure | BackendKit",
    description:
      "Generate UUID v4 (random) and v7 (timestamp-sortable) identifiers instantly. Powered by Web Crypto API. Bulk generation up to 50 at a time.",
    images: [{ url: "/image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UUID Generator Online — v4 & v7, Crypto-Secure | BackendKit",
    description:
      "Generate UUID v4 (random) and v7 (timestamp-sortable) identifiers instantly. Powered by Web Crypto API. Bulk generation up to 50 at a time.",
    images: ["/image.png"],
  },
  alternates: {
    canonical: "https://backendkit.maheshpawar.me/tools/uuid-generator",
  },
};

export default function Layout({ children }) {
  return children;
}
