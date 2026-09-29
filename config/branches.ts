// ─────────────────────────────────────────────────────────────────
//  지점(분원) 공통 설정  —  PC 상단 지점바 · 모바일 지점 드롭다운 ·
//  전체 지점 안내창이 모두 이 파일 하나를 사용합니다.
//
//  · 현재 사이트는 "수원점" 입니다 (current: true).
//  · 평촌점 링크: pyeongchon 의 `href` (https://pc5a.vercel.app)
//    href 는 내부 경로("/..."), 서브도메인, 별도 도메인 무엇이든 됩니다.
// ─────────────────────────────────────────────────────────────────
import { SITE } from "./homepage";

export type BranchStatus = "운영중" | "준비중";

export interface Branch {
  id: string;
  name: string;      // 짧은 이름 (상단바 표기) — 예: "수원"
  label: string;     // 지점명 — 예: "수원점"
  full: string;      // 전체 명칭 — 예: "5A 아카데미 수원점"
  href: string;      // 이동 주소 (비어 있으면 준비중 취급)
  current: boolean;  // 현재 보고 있는 지점인지
  status: BranchStatus;
  address?: string;  // 확인된 정보만 (없으면 표시 안 함)
  tel?: string;      // 확인된 정보만
  region?: string;   // 카드용 짧은 위치 표기 (선택)
}

export const BRANCHES: Branch[] = [
  {
    id: "pyeongchon",
    name: "평촌",
    label: "평촌점",
    full: "5A 아카데미 평촌점",
    href: "https://pc5a.vercel.app", // 평촌점 홈페이지
    current: false,
    status: "운영중",
    address: "경기도 안양시 평촌대로 112",
    tel: "031-347-5151",
    region: "경기 안양 평촌",
  },
  {
    id: "suwon",
    name: "수원",
    label: "수원점",
    full: "5A 아카데미 수원점",
    href: "/",                 // 현재 사이트 홈
    current: true,
    status: "운영중",
    address: SITE.footer.address,
    tel: SITE.footer.tel,
    region: "경기 수원 장안구",
  },
];

export const CURRENT_BRANCH: Branch = BRANCHES.find((b) => b.current) ?? BRANCHES[0];

/** 다른 지점으로 실제 이동이 가능한 상태인지 (준비중/주소없음/현재지점이면 false) */
export function isBranchLinkReady(b: Branch): boolean {
  return !b.current && b.status === "운영중" && b.href.trim() !== "";
}
