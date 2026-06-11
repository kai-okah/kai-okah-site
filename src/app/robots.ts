import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";

// Required by output: "export" — generate this route at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${profile.siteUrl}/sitemap.xml`,
  };
}
