import Link from "next/link";
import { targetLabel } from "@/lib/types";
import type { Notice, EventItem } from "@/lib/types";

// 수원점: 공지사항 패널 숨김 → 입시설명회만 가로로 넓게 표시. (공지 다시 쓰려면 true)
const SHOW_NOTICES = false;

export default function NoticeEvents({
  notices,
  events,
}: {
  notices: Notice[];
  events: EventItem[];
}) {
  const sortedNotices = [...notices].sort((a, b) => a.order - b.order);
  const sortedEvents = [...events].sort((a, b) => a.order - b.order);

  if (!SHOW_NOTICES) {
    // 접수중/접수예정 설명회 우선 (최대 2개), 없으면 가장 앞 1개
    const open = sortedEvents.filter((e) => !/마감|종료/.test(e.status || ""));
    const list = (open.length ? open : sortedEvents).slice(0, 2);
    return (
      <section className="mx-auto max-w-6xl px-5 pt-14 lg:px-8">
        <PanelHeader title="입시설명회" moreHref="/events" />
        {list.length === 0 ? (
          <Panel className="bg-[#F6F7FB]">
            <ul>
              <Empty>등록된 입시설명회가 없습니다</Empty>
            </ul>
          </Panel>
        ) : (
          <div className="flex flex-col gap-3">
            {list.map((e) => (
              <WideEventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 pt-14 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-2">
        {/* 공지사항 */}
        <div className="flex min-w-0 flex-col">
          <PanelHeader title="공지사항" moreHref="/notices" />
          <Panel className="bg-[#F6F7FB] flex-1">
            <ul>
              {sortedNotices.slice(0, 3).map((n) => (
                <Row key={n.id} href={n.href && n.href !== "#" ? n.href : `/notices/${n.id}`} title={n.title} date={n.date} badge={n.badge} />
              ))}
              {sortedNotices.length === 0 && <Empty>등록된 공지사항이 없습니다</Empty>}
            </ul>
          </Panel>
        </div>

        {/* 입시설명회 */}
        <div className="flex min-w-0 flex-col">
          <PanelHeader title="입시설명회" moreHref="/events" />
          <Panel className="bg-[#F6F7FB] flex-1">
            <ul>
              {sortedEvents.slice(0, 1).map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
              {sortedEvents.length === 0 && <Empty>등록된 입시설명회가 없습니다</Empty>}
            </ul>
          </Panel>
        </div>
      </div>
    </section>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={"rounded-2xl border border-line p-5 " + className}>{children}</div>;
}

function PanelHeader({ title, moreHref }: { title: string; moreHref: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-xl font-extrabold text-ink">{title}</h3>
      <Link href={moreHref} aria-label={`${title} 더보기`} className="text-gray-400 hover:text-brand">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </Link>
    </div>
  );
}

function Row({
  href,
  title,
  date,
  badge,
}: {
  href: string;
  title: string;
  date: string;
  badge?: string;
}) {
  return (
    <li className="border-b border-line/70 last:border-0">
      <Link href={href} className="group flex items-center gap-3 py-3.5">
        <span className="flex-1 truncate text-[15px] text-gray-700 transition-colors group-hover:text-brand">
          {badge && (
            <span className="mr-2 rounded bg-brand-light px-1.5 py-0.5 text-[11px] font-bold text-brand">
              {badge}
            </span>
          )}
          {title}
        </span>
        <span className="shrink-0 text-[13px] text-gray-400">{date}</span>
      </Link>
    </li>
  );
}

function EventRow({ event }: { event: EventItem }) {
  const targets = targetLabel(event.targets).split(/[,\u00b7]/).map((t) => t.trim()).filter(Boolean);
  const status = event.status || "접수중";
  const closed = /마감|종료/.test(status);
  const href = event.href && event.href !== "#" ? event.href : `/events/${event.id}`;
  const when = event.eventDate || event.date;
  const pill =
    "shrink-0 rounded-full border px-3 py-1 text-[13px] font-semibold " +
    (closed ? "border-gray-300 bg-gray-50 text-gray-400" : "border-brand bg-white text-brand");
  return (
    <li className="border-b border-line last:border-0">
      <Link href={href} className="group block py-3.5 sm:flex sm:items-center sm:gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            {targets.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {targets.map((t, i) => (
                  <span key={i} className="rounded-md border border-line bg-white px-2 py-0.5 text-[13px] font-medium text-gray-600 sm:px-2.5 sm:py-1 sm:text-sm">
                    {t}
                  </span>
                ))}
              </div>
            )}
            {/* 모바일 전용 상태 배지 */}
            <span className={pill + " sm:hidden"}>{status}</span>
          </div>
          <p className="mt-2 truncate text-[15px] font-bold leading-snug text-ink transition-colors group-hover:text-brand sm:mt-2.5 sm:whitespace-normal sm:text-[19px]">
            {event.title}
          </p>
          <div className="mt-2 flex flex-col gap-y-1 text-[13px] leading-relaxed text-gray-600 sm:mt-2.5 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:text-[15px]">
            {when && (
              <span className="truncate sm:overflow-visible">
                <b className="mr-1.5 font-semibold text-ink">· 일시</b>
                {when}
              </span>
            )}
            {event.location && (
              <span className="truncate sm:overflow-visible">
                <b className="mr-1.5 font-semibold text-ink">· 장소</b>
                {event.location}
              </span>
            )}
          </div>
        </div>
        {/* 데스크톱 전용 상태 원형 */}
        <span
          className={
            "hidden h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border text-center text-sm font-semibold leading-tight transition sm:flex " +
            (closed
              ? "border-gray-300 bg-gray-50 text-gray-400"
              : "border-brand bg-white text-brand group-hover:bg-brand group-hover:text-white")
          }
        >
          {status}
        </span>
      </Link>
    </li>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <li className="py-10 text-center text-sm text-muted">{children}</li>;
}

/** "2026.10.11(일) 14:00" → { md: "10.11", dow: "일", time: "14:00" } */
function parseWhen(text: string) {
  const m = text.match(/(\d{4})[.\-/]\s*(\d{1,2})[.\-/]\s*(\d{1,2})\s*(?:\(([^)]+)\))?\s*(.*)$/);
  if (!m) return null;
  const pad = (v: string) => v.padStart(2, "0");
  return { md: `${pad(m[2])}.${pad(m[3])}`, dow: m[4] || "", time: (m[5] || "").trim() };
}

/** 수원점 메인 — 가로형 설명회 카드 (날짜 블록 · 내용 · 예약 버튼) */
function WideEventCard({ event }: { event: EventItem }) {
  const targets = targetLabel(event.targets).split(/[,\u00b7]/).map((t) => t.trim()).filter(Boolean);
  const status = event.status || "접수중";
  const closed = /마감|종료/.test(status);
  const href = event.href && event.href !== "#" ? event.href : `/events/${event.id}`;
  const whenText = event.eventDate || event.date || "";
  const when = parseWhen(whenText);

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-[#F6F7FB] transition hover:border-brand/40 hover:shadow-[0_6px_24px_rgba(30,42,99,0.08)] sm:flex-row sm:items-stretch"
    >
      {/* 날짜 블록 */}
      <div
        className={
          "flex shrink-0 items-center gap-3 px-5 py-3 sm:w-36 sm:flex-col sm:justify-center sm:gap-1 sm:px-0 sm:py-5 " +
          (closed ? "bg-gray-200 text-gray-500" : "bg-brand text-white")
        }
      >
        {when ? (
          <>
            <span className="text-2xl font-extrabold leading-none tracking-tight sm:text-[32px]">{when.md}</span>
            <span className="text-[13px] font-semibold opacity-90 sm:text-sm">
              {when.dow && `${when.dow}요일`}
              {when.dow && when.time ? " · " : ""}
              {when.time}
            </span>
          </>
        ) : (
          <span className="text-sm font-bold">일정 안내</span>
        )}
      </div>

      {/* 내용 */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 px-5 py-4 sm:px-7 sm:py-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={
              "rounded-full px-2.5 py-0.5 text-[12px] font-bold " +
              (closed ? "bg-gray-200 text-gray-500" : "bg-brand-light text-brand")
            }
          >
            {status}
          </span>
          {targets.map((t, i) => (
            <span key={i} className="rounded-md border border-line bg-white px-2 py-0.5 text-[12px] font-medium text-gray-600">
              {t}
            </span>
          ))}
        </div>
        <p className="text-[17px] font-extrabold leading-snug text-ink transition-colors group-hover:text-brand sm:text-[20px]">
          {event.title}
        </p>
        <div className="flex flex-col gap-y-0.5 text-[13px] text-gray-600 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:text-[14px]">
          {whenText && (
            <span>
              <b className="mr-1.5 font-semibold text-ink">일시</b>
              {whenText}
            </span>
          )}
          {event.location && (
            <span>
              <b className="mr-1.5 font-semibold text-ink">장소</b>
              {event.location}
            </span>
          )}
        </div>
      </div>

      {/* 예약 버튼 */}
      <div className="flex shrink-0 items-center px-5 pb-4 sm:px-7 sm:pb-0">
        <span
          className={
            "inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold transition sm:w-auto " +
            (closed
              ? "border border-gray-300 bg-white text-gray-400"
              : "bg-brand text-white group-hover:bg-brand-dark")
          }
        >
          {closed ? "접수 마감" : "예약하기"}
          {!closed && (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          )}
        </span>
      </div>
    </Link>
  );
}
