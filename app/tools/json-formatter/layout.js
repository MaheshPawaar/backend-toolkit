export const metadata = {
  title: "JSON Formatter & Validator Online — Free, No Server | BackendKit",
  description:
    "Format, minify and validate JSON instantly in your browser. No data leaves your machine. Supports 2-space, 4-space and tab indentation.",
  openGraph: {
    title: "JSON Formatter & Validator Online — Free, No Server | BackendKit",
    description:
      "Format, minify and validate JSON instantly in your browser. No data leaves your machine.",
    images: [{ url: "/image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Formatter & Validator Online — Free, No Server | BackendKit",
    description:
      "Format, minify and validate JSON instantly in your browser. No data leaves your machine.",
    images: ["/image.png"],
  },
  alternates: {
    canonical: "https://backendkit.maheshpawar.me/tools/json-formatter",
  },
};

export default function Layout({ children }) {
  return children;
}
