/** Public profiles. Used in the footer, tip pages and Organization sameAs. */
export const SOCIAL = [
  { id: "youtube", name: "YouTube", handle: "@techtipaday", url: "https://www.youtube.com/@techtipaday", follow: "https://www.youtube.com/@techtipaday?sub_confirmation=1" },
  { id: "tiktok", name: "TikTok", handle: "@tiptechaday", url: "https://www.tiktok.com/@tiptechaday", follow: "https://www.tiktok.com/@tiptechaday" },
  { id: "instagram", name: "Instagram", handle: "@techtipaday", url: "https://www.instagram.com/techtipaday/", follow: "https://www.instagram.com/techtipaday/" },
] as const;
export const SOCIAL_URLS = SOCIAL.map((s) => s.url);
