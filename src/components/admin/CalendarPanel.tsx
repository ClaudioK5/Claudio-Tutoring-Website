import { GOOGLE_CALENDAR_APP_URL, getCalendarEmbedUrl } from "@/lib/admin/calendar";

export function CalendarPanel() {
  return (
    <section className="mt-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Calendar</h2>
          <p className="mt-1 text-sm text-slate-500">Your upcoming lessons from Google Calendar.</p>
        </div>
        <a
          href={GOOGLE_CALENDAR_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#0B1E3F] shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
            <path d="M3.5 10h17M8 3v4M16 3v4" strokeLinecap="round" />
          </svg>
          Open Google Calendar
          <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M7 13 13 7M8 7h5v5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      <div className="admin-card admin-rise mt-6 overflow-hidden p-2 sm:p-3">
        <iframe
          title="Google Calendar — week"
          src={getCalendarEmbedUrl("WEEK")}
          loading="lazy"
          className="hidden h-[640px] w-full rounded-[1.25rem] border-0 sm:block"
        />
        <iframe
          title="Google Calendar — agenda"
          src={getCalendarEmbedUrl("AGENDA")}
          loading="lazy"
          className="block h-[520px] w-full rounded-[1.25rem] border-0 sm:hidden"
        />
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Events are visible only when this browser is signed in to your Google account.
      </p>
    </section>
  );
}
