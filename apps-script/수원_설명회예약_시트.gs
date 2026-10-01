/**
 * 5A 아카데미 수원점 — 설명회 예약(일반 행사) → 구글시트 자동 기록
 *   예: "10/11(일) 2027 윈터스쿨 & 학년별 입시설명회"
 *
 * · 행사마다 탭이 자동으로 따로 생깁니다. (탭 이름 = 행사명)
 *   다음 설명회도 이 시트 하나로 계속 받을 수 있어요.
 * · [DB제공 동의] 접수는 여기로 오지 않습니다. (SHEET_WEBHOOK_URL_DB 쪽 시트로 감)
 *
 * 설치 방법
 *  1) 설명회용 구글시트 열기 → 확장 프로그램 → Apps Script
 *  2) 기본 코드 전부 지우고 이 파일 내용 붙여넣기 → 저장
 *  3) 배포 → 새 배포 → 유형: 웹 앱
 *       - 다음 사용자 인증 정보로 실행: 나
 *       - 액세스 권한이 있는 사용자: 모든 사용자
 *     → 배포 → 권한 승인 → "웹 앱 URL"(…/exec) 복사
 *  4) Vercel sw5a → Settings → Environment Variables
 *       SHEET_WEBHOOK_URL = (복사한 웹 앱 URL)  → Save → Redeploy
 */

// 홈페이지에서 보내는 키 → 시트 머리글
const LABELS = {
  createdAt:    '접수일시',
  eventTitle:   '행사명',
  eventDate:    '행사일시',
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

    // 탭 이름 = 행사명 (시트에서 쓸 수 없는 문자는 바꾸고 100자로 자름)
    const tabName = (String(record.eventTitle || '설명회 예약')
      .replace(/[\[\]\*\?:\\\/]/g, '-').trim() || '설명회 예약').slice(0, 100);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(tabName) || ss.insertSheet(tabName);

    // 첫 접수 때 머리글 자동 작성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(columns.map(function (k) { return LABELS[k] || k; }));
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, columns.length).setFontWeight('bold').setBackground('#eef1fb');
    }

    const row = columns.map(function (k) {
      const v = record[k] == null ? '' : String(record[k]);
      if (k === 'createdAt' && v) {
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

// 배포 후 웹 앱 URL 을 브라우저로 열었을 때 연결 확인용
function doGet() {
  return ContentService.createTextOutput('5A 수원점 설명회 예약 시트 연결 OK');
}
