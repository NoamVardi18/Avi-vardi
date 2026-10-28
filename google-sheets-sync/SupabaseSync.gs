/**
 * אבי ורדי הסעות — סנכרון נתונים מ-Supabase ל-Google Sheets
 * ============================================================
 * גרסה: 2.0 (28.10.2026) — קריאה דרך פונקציה מאובטחת עם טוקן, כי הטבלה נעולה לקריאה ציבורית
 *
 * הגדרות:
 *   1. פתחו Google Sheets חדש
 *   2. לחצו על Extensions → Apps Script
 *   3. הדביקו את הקוד הזה (מחקו את הקוד הקיים)
 *   4. שמרו (Ctrl+S)
 *   5. הריצו את setupTrigger() פעם אחת בלבד כדי להגדיר את ה-Trigger היומי
 *   6. אשרו הרשאות כשהדפדפן יבקש
 *   7. Project Settings (גלגל השיניים) → Script properties → הוסיפו מאפיין
 *      SHEET_SYNC_TOKEN עם הטוקן (מקבלים מנועם; ב-Supabase נשמר רק ה-hash שלו)
 *
 * למה טוקן: מאז 3.8.2026 המפתח הציבורי (anon) יכול רק להוסיף פניות, לא לקרוא אותן.
 * הקריאה עוברת דרך public.avi_leads_for_sheet, שמחזירה את הפניות רק למי שמחזיק בטוקן
 * (supabase/migrations/20261028_sheet_sync_rpc.sql).
 */

// ─── הגדרות ────────────────────────────────────────────────────────────────
const SUPABASE_URL  = "https://nlwkksivgubcgfzqivcs.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sd2trc2l2Z3ViY2dmenFpdmNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NjI1NTUsImV4cCI6MjA5NTUzODU1NX0.Z0rNzhIAxUVG33c4hnj4bNWPwDGbqV-WnWPkixnUzUI";
const SHEET_NAME    = "פניות לקוחות";
const TOKEN_PROPERTY = "SHEET_SYNC_TOKEN";

// כותרות העמודות בגיליון (חייבות להתאים לסדר ב-buildRow)
const HEADERS = ["#", "שם", "טלפון", "מייל", "תאריך נסיעה", "הערות", "נוצר ב"];

// ─── פונקציה ראשית ─────────────────────────────────────────────────────────
/**
 * syncLeads — מושך את כל הרשומות מ-Supabase ומעדכן את הגיליון.
 * הפונקציה מנקה את הגיליון ומאכלסת אותו מחדש בכל הרצה,
 * כך שמחיקות ב-Supabase גם יתבטאו בגיליון.
 */
function syncLeads() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);

  // צור גיליון חדש אם לא קיים
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  const token = PropertiesService.getScriptProperties().getProperty(TOKEN_PROPERTY);
  if (!token) {
    Logger.log("חסר הטוקן: הוסיפו את " + TOKEN_PROPERTY + " ב-Project Settings → Script properties");
    return;
  }

  // שלוף נתונים מ-Supabase (ממוין לפי תאריך יצירה, החדש ביותר ראשון)
  const endpoint = `${SUPABASE_URL}/rest/v1/rpc/avi_leads_for_sheet`;
  const response = UrlFetchApp.fetch(endpoint, {
    method: "POST",
    headers: {
      "apikey":        SUPABASE_ANON,
      "Authorization": `Bearer ${SUPABASE_ANON}`,
      "Content-Type":  "application/json"
    },
    payload: JSON.stringify({ p_token: token }),
    muteHttpExceptions: true
  });

  if (response.getResponseCode() !== 200) {
    Logger.log("שגיאה בשליפת נתונים: " + response.getContentText());
    return;
  }

  const leads = JSON.parse(response.getContentText());

  // נקה את הגיליון ובנה מחדש
  sheet.clearContents();

  // כותרות — שורה 1 בפורמט מודגש
  sheet.appendRow(HEADERS);
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#1e3a5f");
  headerRange.setFontColor("#f59e0b");
  headerRange.setHorizontalAlignment("center");

  // נתונים
  leads.forEach((lead, index) => {
    sheet.appendRow(buildRow(lead, index + 1));
  });

  // עיצוב עמודות
  sheet.setColumnWidth(1, 40);   // #
  sheet.setColumnWidth(2, 160);  // שם
  sheet.setColumnWidth(3, 130);  // טלפון
  sheet.setColumnWidth(4, 200);  // מייל
  sheet.setColumnWidth(5, 120);  // תאריך נסיעה
  sheet.setColumnWidth(6, 260);  // הערות
  sheet.setColumnWidth(7, 190);  // נוצר ב

  // הקפאת שורת הכותרות
  sheet.setFrozenRows(1);

  // עיצוב שורות לסירוגין
  if (leads.length > 0) {
    for (let i = 2; i <= leads.length + 1; i++) {
      const bg = i % 2 === 0 ? "#f8fafc" : "#ffffff";
      sheet.getRange(i, 1, 1, HEADERS.length).setBackground(bg);
    }
  }

  Logger.log(`סנכרון הושלם: ${leads.length} רשומות עודכנו ב-${new Date().toLocaleString("he-IL")}`);
}

// ─── עזרים ─────────────────────────────────────────────────────────────────
/**
 * buildRow — ממיר רשומת Supabase לשורת גיליון.
 */
function buildRow(lead, rowNum) {
  const createdAt = lead.created_at
    ? new Date(lead.created_at).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })
    : "";

  return [
    rowNum,
    lead.name   || "",
    lead.phone  ? "'" + lead.phone : "", // גרש בהתחלה = טקסט, אחרת Sheets מוחק את ה-0 שבתחילת המספר
    lead.email  || "",
    lead.date   || "",
    lead.notes  || "",
    createdAt
  ];
}

// ─── הגדרת Trigger יומי ────────────────────────────────────────────────────
/**
 * setupTrigger — הריצו פונקציה זו פעם אחת בלבד.
 * היא מגדירה Trigger שמריץ את syncLeads כל יום בשעה 08:00.
 *
 * הוראות:
 *   1. בחרו את הפונקציה setupTrigger מהתפריט הנפתח
 *   2. לחצו על כפתור ▶ Run
 *   3. אשרו הרשאות
 */
function setupTrigger() {
  // מחק Triggers קיימים של syncLeads כדי למנוע כפילויות
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === "syncLeads") {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // צור Trigger חדש: כל יום בין 08:00–09:00 (Google בוחר את הדקה המדויקת)
  ScriptApp.newTrigger("syncLeads")
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();

  Logger.log("✅ Trigger הוגדר בהצלחה: syncLeads ירוץ כל יום בשעה 08:00");
  SpreadsheetApp.getUi().alert("✅ הגדרת Trigger הצליחה!\n\nהגיליון יתעדכן אוטומטית כל יום בשעה 08:00.");
}

/**
 * removeTrigger — הסר את ה-Trigger אם רוצים לבטל את העדכון האוטומטי.
 */
function removeTrigger() {
  let removed = 0;
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === "syncLeads") {
      ScriptApp.deleteTrigger(trigger);
      removed++;
    }
  });
  Logger.log(`הוסרו ${removed} Triggers של syncLeads`);
}
