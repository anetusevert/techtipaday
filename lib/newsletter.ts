/** Beehiiv free plan: no API, and server-side POSTs are blocked. */
export const BEEHIIV_PUBLICATION = "https://techtipaday.beehiiv.com";
export const BEEHIIV_SUBSCRIBE = `${BEEHIIV_PUBLICATION}/subscribe`;
export const BEEHIIV_FORM_ID = "504a21de-5a19-45e8-97d0-c8daf5455d5a";
export const BEEHIIV_LOADER = "https://subscribe-forms.beehiiv.com/v3/loader.js";
export const BEEHIIV_ATTRIBUTION = "https://subscribe-forms.beehiiv.com/attribution.js";

export function beehiivSubscribeUrl(email?: string) {
  const url = new URL(BEEHIIV_SUBSCRIBE);
  const trimmed = email?.trim();
  if (trimmed) url.searchParams.set("email", trimmed);
  return url.toString();
}
