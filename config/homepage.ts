// ============================================================================
//  홈페이지 코드 설정 — 관리자 페이지가 아니라 "여기서 직접" 수정하는 항목들
//
//  · 롤링 슬라이드(SLIDES)   · 포스터(POSTER)   · 배너 슬라이드(BANNERS)
//  · 홍보 배너(PROMO)        · 사이트 정보(SITE, 헤더/푸터/과목탭/소셜)
//
//  이미지는 public/ 폴더에 넣고 "/파일명" 경로로 적으면 됩니다.
//  (예: public/slide-a.jpg  ->  image: "/slide-a.jpg")
//
//  ※ 선생님 · 공지사항 · 입시설명회 · 영상은 관리자 페이지(/admin)에서 관리합니다.
// ============================================================================

import type { Slide, Poster, Promo, SiteSettings } from "@/lib/types";

/* ── 단과시간표 · 브로셔 공개 스위치 ─────────────────────────────────────────
   SCHEDULE_READY = false → 단과시간표 · 강좌 상세 · 선생님 "개설 강좌" 모두 "준비 중" 표시
   BROCHURE = null        → 단과시간표 상단 PDF(바로보기·다운로드) 숨김
   수원점 시간표/브로셔가 준비되면 true / { title, file } 로 바꾸세요. */
export const SCHEDULE_READY = false;
export const BROCHURE: { title: string; file: string } | null = null;
// 예) export const BROCHURE = { title: "10월 단과 안내 PDF", file: "/2026-10-schedule-brochure.pdf" };

/* ── 히어로 왼쪽: 롤링 슬라이드 (위에서부터 순서대로 재생) ────────────────── */
export const SLIDES: Slide[] = [
  { id: "s1", image: "/hero-2.png", href: "/admission/winter", alt: "2027 윈터스쿨", order: 1, active: true },
  { id: "s2", image: "/hero-1.png", href: "/events/e1", alt: "2027 윈터스쿨 & 입시설명회", order: 2, active: true },
];

/* ── 히어로 오른쪽: 포스터 (하나) ─────────────────────────────────────────── */
export const POSTER: Poster = {
  id: "p1",
  image: "/poster.png",
  href: "/admission/winter",
  alt: "2027 윈터스쿨 포스터",
  order: 1,
  active: true,
};

/* ── 롤링창·포스터 바로 밑: 배너 슬라이드 (위에서부터 순서대로 재생) ──────────
   image = PC용(1956×168), mobileImage = 모바일용(1080×320)
   href 를 비우면("") 클릭해도 이동하지 않습니다. 외부 링크는 새 창으로 열립니다. */
export const BANNERS: Promo[] = [
  {
    image: "/banner-open-pc.png",
    mobileImage: "/banner-open-mo.png",
    href: "",
    alt: "5A 수원정자점 GRAND OPEN!",
  },
  {
    image: "/banner-seminar-pc.png",
    mobileImage: "/banner-seminar-mo.png",
    href: "https://forms.gle/o2jUEqJEyt9U9u2m8",
    alt: "2027 윈터스쿨 & 학년별 입시전략 설명회 — 2026.10.11(일) 오후 2시, 롯데시네마 북수원점 1관 · 설명회 신청하기",
  },
];

/* ── 영상 섹션 우측 하단: 홍보 사각배너 ───────────────────────────────────── */
export const PROMO: Promo = {
  image: "/promo.png",
  href: "#",
  alt: "2024 연간 학습 프로그램",
};

/* ── 사이트 전역 정보: 헤더 브랜드 / 강사 과목 탭 / 푸터 / 소셜 ──────────────── */
export const SITE: SiteSettings = {
  brandName: "아카데미",
  sectionTitle: "5A아카데미 선생님 클립영상",
  subjects: ["국어", "수학", "영어", "사회탐구", "과학탐구", "논술"],
  footer: {
    company: "",
    address: "경기 수원시 장안구 정자천로173번길 11-6 (정자동, 세경프라자) 3층",
    bizNo: "217-99-87249",
    tel: "031-347-5151",
    fax: "031-386-1886",
    regNo: "제2024-089호",
    copyright: "Copyright ⓒ 5A 아카데미 All Right Reserved.",
    brand: "5A 아카데미",
  },
  social: { naver: "https://blog.naver.com/5aacademy", instagram: "https://www.instagram.com/5aacademy_51", facebook: "#", youtube: "#", kakao: "#", phone: "031-347-5151" },
};

/* ── 오시는 길: 학원 위치 (구글 지도 임베드) ──────────────────────────────
   지도는 구글 지도(무료·키 불필요)로 표시됩니다.
   address 를 실제 주소로 맞추면 그 위치가 지도에 표시됩니다. */
export const LOCATION = {
  name: "5A 아카데미 수원점",
  address: "경기 수원시 장안구 정자천로173번길 11-6 (정자동, 세경프라자) 3층",
  lat: 37.3899,
  lng: 126.9513,
  mapQuery: "5A아카데미 수원점", // 지도 바로가기 버튼 검색어
};
