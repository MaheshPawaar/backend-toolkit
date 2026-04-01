export const metadata = {
  title: "JWT Decoder Online — Decode Tokens & Inspect Claims | BackendKit",
  description:
    "Decode JWT tokens instantly in your browser. Inspect header, payload, expiry and claims. No token ever leaves your machine.",
  openGraph: {
    title: "JWT Decoder Online — Decode Tokens & Inspect Claims | BackendKit",
    description:
      "Decode JWT tokens instantly in your browser. Inspect header, payload, expiry and claims. No token ever leaves your machine.",
    images: [{ url: "/image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Decoder Online — Decode Tokens & Inspect Claims | BackendKit",
    description:
      "Decode JWT tokens instantly in your browser. Inspect header, payload, expiry and claims. No token ever leaves your machine.",
    images: ["/image.png"],
  },
  alternates: {
    canonical: "https://backendkit.maheshpawar.me/tools/jwt-decoder",
  },
};

export default function Layout({ children }) {
  return children;
}
