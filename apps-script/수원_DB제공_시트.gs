/**
 * 5A 아카데미 수원점 — [DB제공 동의] 접수 → 구글시트 자동 기록
 *
 * 홈페이지(sw5a)의 /api/reservations 가 아래 형식으로 POST 합니다.
 *   { columns: ["createdAt","eventTitle",...], record: { createdAt: "...", name: "...", ... } }
 *
 * 설치 방법
 *  1) 수원용 구글시트 열기 → 확장 프로그램 → Apps Script
 *  2) 기본 코드 전부 지우고 이 파일 내용 붙여넣기 → 저장
 *  3) 배포 → 새 배포 → 유형: 웹 앱
 *       - 다음 사용자 인증 정보로 실행: 나
 *       - 액세스 권한이 있는 사용자: 모든 사용자
 *     → 배포 → 권한 승인 → "웹 앱 URL" 복사 (…/exec 로 끝나는 주소)
 *  4) Vercel sw5a → Settings → Environment Variables
 *       SHEET_WEBHOOK_URL_DB = (복사한 웹 앱 URL)  → Save → Redeploy
 *
 * ※ 코드를 고친 뒤에는 "배포 관리 → 수정(연필) → 버전: 새 버전" 으로 다시 배포해야 반영됩니다.
 *    (새 배포를 만들면 URL 이 바뀌므로 Vercel 값도 바꿔야 함)
 */

const SHEET_NAME = 'DB제공';   // 기록할 탭 이름 (없으면 자동 생성)

// 홈페이지에서 보내는 키 → 시트 머리글
const LABELS = {
  createdAt:    '접수일시',
  eventTitle:   '행사명',
  eventDate:    '행사일',
  type:         '예약자 구분',
  name:         '학생이름',
  phone:        '학부모 연락처',
  studentPhone: '학생 연락처',
  school:       '학교명',
  grade:        '학년',
  track:        '계열',
  companions:   '동반인',
  source:       '유입경로',
  marketing:    '마케팅 수신동의',
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // 동시 접수 시 행이 겹치지 않도록
  try {
    const body = JSON.parse(e.postData.contents);
    const columns = body.columns || Object.keys(LABELS);
    const record = body.record || {};

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // 첫 접수 때 머리글 자동 작성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(columns.map(function (k) { return LABELS[k] || k; }));
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, columns.length).setFontWeight('bold').setBackground('#eef1fb');
    }

    const row = columns.map(function (k) {
      const v = record[k] == null ? '' : String(record[k]);
      if (k === 'createdAt' && v) {
        // ISO 시간 → 한국시간 "2026-10-01 14:05:33"
        return Utilities.formatDate(new Date(v), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
      }
      // 전화번호 앞자리 0 이 사라지지 않도록 텍스트로 기록
      if ((k === 'phone' || k === 'studentPhone') && v) return "'" + v;
      return v;
    });
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 배포 후 브라우저로 웹 앱 URL 을 열었을 때 동작 확인용
function doGet() {
  return ContentService.createTextOutput('5A 수원점 DB제공 시트 연결 OK');
}
