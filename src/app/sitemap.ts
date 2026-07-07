import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://spicykitchengorkha.com";

  const routes = [
    "",
    "/about",
    "/menu",
    "/gallery",
    "/reservation",
    "/order",
    "/contact",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : ["/menu", "/reservation", "/order"].includes(route) ? 0.9 : 0.7,
  }));
}
