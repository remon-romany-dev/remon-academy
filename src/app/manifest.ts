import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "أكاديمية ريمون",
    description: "كورسات برمجة وتصميم وتسويق وذكاء اصطناعي، أونلاين وحضوري.",
    start_url: "/",
    display: "standalone",
    lang: "ar",
    dir: "rtl",
    background_color: "#0b1511",
    theme_color: "#0b1511",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
