import { CONTACT } from "@/lib/constants";

/** Google Calendar → Settings → (calendar) → Integrate calendar → Calendar ID. */
export const GOOGLE_CALENDAR_ID = CONTACT.email;

export const GOOGLE_CALENDAR_APP_URL = "https://calendar.google.com/calendar/r";

export function getCalendarEmbedUrl(mode: "WEEK" | "AGENDA") {
  const params = new URLSearchParams({
    src: GOOGLE_CALENDAR_ID,
    ctz: "Europe/Rome",
    mode,
    wkst: "2",
    showTitle: "0",
    showPrint: "0",
    showCalendars: "0",
    showTz: "0",
    bgcolor: "#ffffff",
  });
  return `https://calendar.google.com/calendar/embed?${params}`;
}
