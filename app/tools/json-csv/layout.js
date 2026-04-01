export const metadata = {
  title: "Convert JSON to CSV Online — Free, No Upload | BackendKit",
  description:
    "Convert JSON arrays to CSV instantly in your browser. Paste or upload a file — handles large datasets without freezing. No data sent to any server.",
  openGraph: {
    title: "Convert JSON to CSV Online — Free, No Upload | BackendKit",
    description:
      "Convert JSON arrays to CSV instantly in your browser. Paste or upload a file — handles large datasets without freezing.",
    images: [{ url: "/image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert JSON to CSV Online — Free, No Upload | BackendKit",
    description:
      "Convert JSON arrays to CSV instantly in your browser. Paste or upload a file — handles large datasets without freezing.",
    images: ["/image.png"],
  },
  alternates: {
    canonical: "https://backendkit.maheshpawar.me/tools/json-csv",
  },
};

export default function Layout({ children }) {
  return children;
}
