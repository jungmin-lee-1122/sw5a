import { NextResponse } from "next/server";
import { collectionRoutes } from "@/lib/api";
import { isAuthed } from "@/lib/guard";
import { stripEventSecrets } from "@/lib/content";
import type { EventItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const routes = collectionRoutes<EventItem>("events");
export const POST = routes.POST;

// 관리자에게만 구글시트 주소(sheetWebhook)를 보여주고, 방문자에게는 숨깁니다.
export async function GET() {
  const res = await routes.GET();
  if (await isAuthed()) return res;
  const items = (await res.json()) as EventItem[];
  return NextResponse.json(items.map(stripEventSecrets));
}
