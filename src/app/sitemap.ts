import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";

// Required by output: "export" — generate this route at build time.
export const dynamic = "force-static";

// One page, one entry. Generated at build time (static export).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: profile.siteUrl, lastModified: new Date() }];
}
