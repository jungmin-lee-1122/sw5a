// 콘텐츠 로더 — 관리자에서 관리하는 항목만 저장소에서 읽습니다.
// (슬라이드/포스터/배너/사이트정보는 config/homepage.ts 에서 직접 수정)
import { listCollection } from "./store";
import { SEEDS } from "./seeds";
import type { Teacher, Notice, EventItem, VideoItem, MealMenu, GalleryItem, ReviewItem, TeacherCourse, AdmissionResult, UnivGroup, SuccessStory, ScoreCase } from "./types";

export async function getTeachers(): Promise<Teacher[]> {
  const teachers = await listCollection<Teacher>("teachers", SEEDS.teachers as Teacher[]);
  // 강좌 id 보정 — 예전에 저장돼 id가 없는 강좌도 항상 클릭 가능하도록 안정적 id 부여
  return teachers.map((t) => ({
    ...t,
    courses: (t.courses ?? []).map((c, i) => (c.id ? c : { ...c, id: `${t.id}-c${i}` })),
  }));
}
export const getNotices = () => listCollection<Notice>("notices", SEEDS.notices as Notice[]);
/** 공개 화면용 — 구글시트 주소(sheetWebhook)는 빼고 반환 */
export const getEvents = async () =>
  (await listCollection<EventItem>("events", SEEDS.events as EventItem[])).map(stripEventSecrets);
/** 방문자에게 보내면 안 되는 필드 제거 */
export function stripEventSecrets(e: EventItem): EventItem {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sheetWebhook, ...rest } = e;
  return rest;
}
/** 서버 전용 — 특정 설명회의 구글시트 주소 */
export async function getEventSheetWebhook(id: string): Promise<string> {
  const all = await listCollection<EventItem>("events", SEEDS.events as EventItem[]);
  const url = (all.find((e) => e.id === id)?.sheetWebhook ?? "").trim();
  return /^https:\/\//.test(url) ? url : "";
}
export const getVideos = () => listCollection<VideoItem>("videos", SEEDS.videos as VideoItem[]);
export const getMenus = () => listCollection<MealMenu>("menus", SEEDS.menus as MealMenu[]);
export const getGallery = () => listCollection<GalleryItem>("gallery", SEEDS.gallery as GalleryItem[]);
export const getReviews = () => listCollection<ReviewItem>("reviews", SEEDS.reviews as ReviewItem[]);
export const getUnivPass = () => listCollection<AdmissionResult>("univpass", SEEDS.univpass as AdmissionResult[]);
export const getUnivGroups = () => listCollection<UnivGroup>("univgroups", SEEDS.univgroups as UnivGroup[]);
export const getStories = () => listCollection<SuccessStory>("stories", SEEDS.stories as SuccessStory[]);
export const getScoreCases = () => listCollection<ScoreCase>("scorecases", SEEDS.scorecases as ScoreCase[]);
/** 강좌 + 소속 선생님 정보 (단과시간표/강좌 상세용) */
export interface CourseWithTeacher extends TeacherCourse {
  teacherId: string;
  teacherName: string;
  teacherPhoto: string;
  subject: string;
}

/** 모든 선생님의 개설 강좌를 평탄화해 반환 */
export async function getAllCourses(): Promise<CourseWithTeacher[]> {
  const teachers = await getTeachers();
  return teachers
    .filter((t) => t.active)
    .flatMap((t) =>
      (t.courses ?? []).map((c) => ({
        ...c,
        teacherId: t.id,
        teacherName: t.name,
        teacherPhoto: t.photo,
        subject: t.subject,
      })),
    );
}
