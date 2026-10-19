import type { EventItem } from "@/lib/types";

/** 외부 신청서(구글폼)로 받는 설명회용 — 상세 페이지 우측 카드 + 모바일 하단 고정 버튼 */

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  );
}

function ApplyButton({ url, closed, className = "" }: { url: string; closed: boolean; className?: string }) {
  if (closed) {
    return (
      <span className={`flex h-14 w-full items-center justify-center rounded-xl bg-gray-100 text-[16px] font-bold text-gray-400 ${className}`}>
        접수 마감
      </span>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-brand to-brand-dark text-[16px] font-bold tracking-[-0.01em] text-white shadow-[0_10px_24px_-8px_rgba(47,71,184,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-8px_rgba(30,42,99,0.6)] active:translate-y-0 ${className}`}
    >
      예약 신청하러 가기
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-1">
        <ArrowIcon />
      </span>
    </a>
  );
}

const STEPS = ["아래 버튼을 눌러 신청서를 엽니다", "학생 · 학부모 정보를 입력합니다", "제출하면 예약 신청이 완료됩니다"];

export default function ExternalApply({ event, url }: { event: EventItem; url: string }) {
  const closed = /마감|종료/.test(event.status ?? "");
  const when = event.eventDate || event.date;

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_6px_24px_rgba(30,42,99,0.06)]">
        {/* 헤더 */}
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-brand to-brand-dark px-6 py-6 text-white">
          <div aria-hidden="true" className="absolute -right-10 -top-12 -z-10 h-36 w-36 rounded-full bg-white/10" />
          <div aria-hidden="true" className="absolute -bottom-14 right-14 -z-10 h-28 w-28 rounded-full bg-white/5" />
          <p className="text-[11px] font-bold tracking-[0.18em] text-white/70">ONLINE RESERVATION</p>
          <h2 className="mt-1.5 text-xl font-extrabold">설명회 예약 신청</h2>
          {when && <p className="mt-1 text-sm text-white/80">{when}</p>}
        </div>

        {/* 본문 */}
        <div className="px-6 pb-6 pt-5">
          <ol className="space-y-3">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-3 text-[14px] text-gray-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-light text-xs font-bold text-brand">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>

          <ApplyButton url={url} closed={closed} className="mt-6" />

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            신청서는 새 창(구글 폼)으로 열립니다
          </p>
        </div>
      </div>

      {/* 모바일 하단 고정 버튼 */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        <ApplyButton url={url} closed={closed} />
      </div>
    </>
  );
}
