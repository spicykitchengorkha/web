/**
 * Resolves a stored image key (e.g. "hero-curry") or full URL to a usable image source path.
 * In Next.js, copied assets are served statically from "/assets/".
 */
export function resolveImage(keyOrUrl: string | null | undefined): string {
  if (!keyOrUrl || keyOrUrl.trim().length < 2) {
    return "/assets/hero-curry.jpg"; // Default global fallback
  }

  // Handle Google search image link parameter redirects if any
  if (keyOrUrl.includes("google.com/imgres")) {
    try {
      const urlParams = new URLSearchParams(keyOrUrl.split("?")[1]);
      const directUrl = urlParams.get("imgurl");
      if (directUrl) return directUrl;
    } catch (e) {
      console.warn("Failed to parse Google Image URL redirect", e);
    }
  }

  const defaultApiBase = (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))
    ? "http://127.0.0.1:8000/api"
    : "https://api.spicykitchengorkha.com/api";

  if (keyOrUrl.startsWith("http")) {
    if (keyOrUrl.includes("localhost") || keyOrUrl.includes("127.0.0.1")) {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL !== "/api")
        ? process.env.NEXT_PUBLIC_API_URL
        : defaultApiBase;
      if (apiBase.startsWith("http")) {
        const backendBase = apiBase.replace(/\/api$/, "");
        const storageIndex = keyOrUrl.indexOf("/storage/");
        if (storageIndex !== -1) {
          return `${backendBase}${keyOrUrl.substring(storageIndex)}`;
        }
      }
    }
    return keyOrUrl;
  }

  if (keyOrUrl.includes("storage/")) {
    let path = keyOrUrl;
    while (path.startsWith("/")) path = path.substring(1);
    while (path.startsWith("storage/storage/")) {
      path = path.substring(8);
    }
    if (!path.startsWith("storage/")) {
      path = "storage/" + path;
    }
    const apiBase = (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL !== "/api")
      ? process.env.NEXT_PUBLIC_API_URL
      : defaultApiBase;
    const backendBase = apiBase.startsWith("http") ? apiBase.replace(/\/api$/, "") : "";
    return `${backendBase}/${path}`;
  }

  if (keyOrUrl.startsWith("/")) return keyOrUrl;

  // File extension mappings
  if (keyOrUrl === "logo" || keyOrUrl === "log") {
    return `/assets/${keyOrUrl}.png`;
  }
  if (keyOrUrl === "burger-hero") {
    return `/assets/${keyOrUrl}.png`;
  }

  // Default to jpg for other menu images
  return `/assets/${keyOrUrl}.jpg`;
}
