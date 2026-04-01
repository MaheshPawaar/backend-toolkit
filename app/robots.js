export const dynamic = "force-static";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://backendkit.maheshpawar.me/sitemap.xml",
  };
}
