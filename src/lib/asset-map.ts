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

  if (keyOrUrl.startsWith("http")) return keyOrUrl;

  if (keyOrUrl.includes("storage/")) {
    let path = keyOrUrl;
    while (path.startsWith("/")) path = path.substring(1);
    while (path.startsWith("storage/storage/")) {
      path = path.substring(8);
    }
    if (!path.startsWith("storage/")) {
      path = "storage/" + path;
    }
    return `/${path}`;
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
