import React, { useRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import {
  OWNER_NAME,
  OWNER_PHONE,
  OWNER_PHONE_DISPLAY,
  OWNER_EMAIL,
  LEAD_RETENTION,
  ACCESSIBILITY_COORDINATOR,
  PRIVACY_POLICY_UPDATED,
  ACCESSIBILITY_AUDITED,
  ACCESSIBILITY_STATEMENT_UPDATED,
} from "@shared/const";

// Radix supplies what the old hand-rolled modals lacked: focus moves into the dialog, Tab is
// trapped inside it, and Esc closes it. Returning focus is done here: Radix only restores it to
// its own <Dialog.Trigger>, and these dialogs are opened by ordinary buttons.
function LegalDialog({
  open,
  onOpenChange,
  title,
  closeLabel,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-ink-deep/70 backdrop-blur-sm grid place-items-center overflow-y-auto p-4">
          <DialogPrimitive.Content
            ref={contentRef}
            dir="rtl"
            aria-describedby={undefined}
            tabIndex={-1}
            // Focus the dialog itself rather than its first button, so a screen reader starts at
            // the title and arrow keys scroll the (long) text.
            onOpenAutoFocus={(e) => {
              // Fires before focus moves, so activeElement is still the button that opened us.
              returnFocusTo.current = document.activeElement as HTMLElement | null;
              e.preventDefault();
              contentRef.current?.focus();
            }}
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              const el = returnFocusTo.current;
              if (el && el !== document.body && document.contains(el)) el.focus();
              returnFocusTo.current = null;
            }}
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-cream rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 text-right outline-none"
          >
            <DialogPrimitive.Close
              className="absolute top-4 left-4 text-stone-600 hover:text-ink transition-colors cursor-pointer rounded"
              aria-label={closeLabel}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </DialogPrimitive.Close>
            <DialogPrimitive.Title asChild>
              <h2 className="font-display text-xl font-bold text-ink mb-1 pl-8">{title}</h2>
            </DialogPrimitive.Title>
            {children}
            <DialogPrimitive.Close className="mt-6 w-full bg-ink hover:bg-ink-deep text-cream font-bold py-2.5 rounded-lg transition-colors cursor-pointer">
              סגור
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function Todo({ children }: { children: React.ReactNode }) {
  return <mark className="bg-gold/25 text-ink px-1 rounded">[להשלמה: {children}]</mark>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="font-bold text-ink text-base">{title}</h3>
      {children}
    </section>
  );
}

const phoneLink = (
  <a href={`tel:${OWNER_PHONE}`} className="text-gold-deep underline font-bold" dir="ltr">{OWNER_PHONE_DISPLAY}</a>
);
const emailLink = OWNER_EMAIL ? (
  <a href={`mailto:${OWNER_EMAIL}`} className="text-gold-deep underline font-bold" dir="ltr">{OWNER_EMAIL}</a>
) : (
  <Todo>כתובת מייל</Todo>
);

type DialogProps = { open: boolean; onOpenChange: (open: boolean) => void };

// What this says about where data goes was checked against the code and the live backend on
// 2026-10-27, not assumed: server/routers.ts → server/supabase.ts inserts into public.leads in
// Supabase project avi-vardi-bus (eu-central-1); its on_lead_inserted trigger calls the
// notify-owner edge function, which emails the lead to Avi through Resend (customer confirmations
// once a Resend domain is verified). A daily Apps Script (google-sheets-sync/SupabaseSync.gs, bound
// to the sheet "אבי ורדי הסעות — ניהול פניות" in Noam's Google account) copies every lead into
// that sheet through the token-gated RPC avi_leads_for_sheet. Change the flow, change this text.
export function PrivacyPolicyDialog(props: DialogProps) {
  return (
    <LegalDialog {...props} title="מדיניות פרטיות" closeLabel="סגור מדיניות פרטיות">
      <p className="text-xs text-stone-600 mb-4">עודכנה לאחרונה: {PRIVACY_POLICY_UPDATED}</p>
      <div className="text-stone-700 text-sm leading-relaxed space-y-5">
        <Section title="מי אחראי על המידע">
          <p>
            האתר avivardi.online והשירות מופעלים על ידי {OWNER_NAME}, עוסק מורשה ("אבי ורדי הסעות"), מבשרת ציון.
            {" "}{OWNER_NAME} הוא האחראי על מאגר הפניות שמתקבלות באתר.
          </p>
          <p>ליצירת קשר בכל נושא של פרטיות: טלפון {phoneLink} · מייל {emailLink}</p>
        </Section>

        <Section title="אילו פרטים נאספים בטופס ההזמנה ולמה">
          <ul className="list-disc pr-5 space-y-1">
            <li><strong>שם מלא וטלפון</strong> (חובה) — כדי שאבי יוכל לחזור אליכם.</li>
            <li><strong>מייל</strong> (לא חובה) — אם תעדיפו שיחזרו אליכם במייל.</li>
            <li><strong>פרטי הנסיעה</strong>: סוג הנסיעה, נקודת יציאה, יעד, תאריך, מספר נוסעים ופרטים נוספים שתכתבו (לא חובה) — כדי לתת הצעת מחיר ולתאם את הנסיעה.</li>
          </ul>
          <p>
            הפרטים משמשים רק לטיפול בפנייה שלכם: חזרה אליכם, הצעת מחיר ותיאום הנסיעה. לא נשלח לכם דיוור שיווקי,
            ולא נמכור או נעביר את הפרטים לאף אחד לשימוש שלו.
          </p>
          <p>
            אין חובה חוקית למסור את הפרטים. בלי שם וטלפון לא נוכל לחזור אליכם, ואפשר תמיד פשוט להתקשר או לשלוח וואטסאפ.
          </p>
        </Section>

        <Section title="לאן הפרטים נשלחים ואיפה הם נשמרים">
          <p>כשאתם שולחים את הטופס:</p>
          <ul className="list-disc pr-5 space-y-1">
            <li>הפרטים עוברים בחיבור מוצפן (HTTPS) לשרת של האתר, שמאוחסן אצל <strong>Vercel</strong>.</li>
            <li>הם נשמרים במסד נתונים של <strong>Supabase</strong>, בשרתים באיחוד האירופי (פרנקפורט, גרמניה). רק בעל העסק ומי שמתחזק עבורו את האתר יכולים לקרוא אותם.</li>
            <li>מייל עם פרטי הפנייה נשלח לתיבת הדואר של אבי (Gmail של Google) דרך שירות שליחת המיילים <strong>Resend</strong>.</li>
            <li>עותק של פרטי הפניות נשמר גם בגיליון <strong>Google Sheets</strong> פרטי שמשמש את העסק למעקב אחרי הפניות.</li>
          </ul>
          <p>
            החברות האלה הן ספקי שירות טכניים שמעבדים את המידע בשבילנו בלבד. חלקן מאחסנות מידע מחוץ לישראל
            (באיחוד האירופי ובארה״ב).
          </p>
          <p>
            אם תבחרו לפנות בוואטסאפ, ההודעה עוברת דרך WhatsApp (של חברת Meta) וחלה עליה גם מדיניות הפרטיות שלהם.
          </p>
        </Section>

        <Section title="עוגיות ו-Google">
          <ul className="list-disc pr-5 space-y-1">
            <li>
              <strong>הכרחי:</strong> האתר זוכר בדפדפן שלכם (localStorage) מה בחרתם בבאנר העוגיות. על זה לא מבקשים הסכמה.
            </li>
            <li>
              <strong>Google Ads (רק באישור):</strong> אם לחצתם "מאשר", נטען תג של Google שמודד אם הגעתם דרך מודעה ואם לחצתם
              על כפתור חיוג או וואטסאפ. התג שומר עוגיות של Google (למשל <span dir="ltr">_gcl_au</span>) ומעביר ל-Google מידע טכני
              כמו כתובת IP, סוג הדפדפן והעמודים שביקרתם בהם. אם בחרתם "רק הכרחיות", התג לא נטען בכלל ולא נשלח ל-Google שום מידע ממנו.
            </li>
            <li>
              <strong>סטטיסטיקה בלי עוגיות:</strong> Vercel Web Analytics ו-Speed Insights סופרים ביקורים ומודדים את מהירות האתר
              באופן מצטבר, בלי עוגיות ובלי לזהות אתכם.
            </li>
            <li>
              <strong>גופנים ותמונות:</strong> הגופנים נטענים משרתי Google Fonts, וחלק מהתמונות משרת אחסון של Amazon (CloudFront),
              ולכן הדפדפן שלכם פונה אליהם (כולל כתובת ה-IP שלכם).
            </li>
          </ul>
          <p>
            <strong>איך מבטלים הסכמה:</strong> בתחתית כל עמוד יש קישור "הגדרות עוגיות". לחצו עליו ובחרו "רק הכרחיות". עוגיות Google
            יימחקו והתג יפסיק לפעול. אפשר גם למחוק עוגיות בהגדרות הדפדפן.
          </p>
        </Section>

        <Section title="הזכויות שלכם">
          <p>לפי חוק הגנת הפרטיות, התשמ״א-1981, אתם יכולים:</p>
          <ul className="list-disc pr-5 space-y-1">
            <li>לעיין בפרטים שנשמרו עליכם;</li>
            <li>לבקש לתקן פרטים לא נכונים, לא שלמים או לא מעודכנים;</li>
            <li>לבקש שנמחק את הפנייה שלכם ואת כל הפרטים שלכם.</li>
          </ul>
          <p>
            פנו לאבי בטלפון {phoneLink} או במייל {emailLink}, ונענה תוך 30 יום לכל היותר. אם לא נעניתם, אפשר לפנות
            לרשות להגנת הפרטיות.
          </p>
        </Section>

        <Section title="כמה זמן הפרטים נשמרים">
          <p>
            פרטי הפנייה נשמרים כל עוד הם נחוצים לטיפול בה ולמתן השירות, ולכל היותר{" "}
            {LEAD_RETENTION ? LEAD_RETENTION : <Todo>תקופת שמירה</Todo>} ממועד הפנייה. אחר כך הם נמחקים.
          </p>
        </Section>

        <Section title="שינויים במדיניות">
          <p>אם נשנה את המדיניות, הגרסה המעודכנת תופיע כאן עם תאריך עדכון חדש.</p>
        </Section>
      </div>
    </LegalDialog>
  );
}

export function AccessibilityStatementDialog(props: DialogProps) {
  return (
    <LegalDialog {...props} title="הצהרת נגישות" closeLabel="סגור הצהרת נגישות">
      <p className="text-xs text-stone-600 mb-4">עודכנה לאחרונה: {ACCESSIBILITY_STATEMENT_UPDATED}</p>
      <div className="text-stone-700 text-sm leading-relaxed space-y-5">
        <Section title="רמת הנגישות">
          <p>
            אבי ורדי הסעות מקפיד שהאתר יהיה נגיש לכל אחד, כולל מי שגולש בעזרת קורא מסך, מקלדת בלבד או הגדלה.
            האתר הונגש לפי תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013,
            ולפי התקן הישראלי ת״י 5568 ברמה <strong>AA</strong>, שמבוסס על הנחיות <span dir="ltr">WCAG 2.1</span>.
          </p>
          <p>
            הבדיקה האחרונה נעשתה ב-{ACCESSIBILITY_AUDITED}: בדיקה אוטומטית בכלי <span dir="ltr">axe</span> של כל עמודי האתר,
            במחשב ובנייד, ובדיקה ידנית של ניווט במקלדת.
          </p>
        </Section>

        <Section title="מה הונגש באתר">
          <ul className="list-disc pr-5 space-y-1">
            <li>אפשר לנווט באתר כולו במקלדת. יש קישור "דלג לתוכן הראשי", ומסגרת מיקוד בולטת מראה איפה אתם נמצאים.</li>
            <li>חלונות "מדיניות פרטיות" ו"הצהרת נגישות" נסגרים ב-Esc. המיקוד נשאר בתוך החלון כל עוד הוא פתוח, וחוזר לכפתור שפתח אותו.</li>
            <li>לכל תמונה שמעבירה מידע יש טקסט חלופי, ותמונות קישוטיות מוסתרות מקוראי מסך.</li>
            <li>הכותרות מסודרות לפי היררכיה, והעמוד מחולק לאזורים (כותרת, ניווט, תוכן ראשי, כותרת תחתונה).</li>
            <li>ניגודיות הצבעים של הטקסט עומדת ביחס הנדרש ברמה AA.</li>
            <li>לכל שדה בטופס ההזמנה יש תווית. שדות החובה מסומנים, והודעות שגיאה מוצגות ליד השדה ומוקראות בקורא מסך.</li>
            <li>האנימציות נעצרות כשמפעילים בדפדפן או במערכת ההפעלה את ההגדרה "הפחתת תנועה".</li>
            <li>לפס היעדים הנע יש כפתור עצירה והפעלה, שאפשר להפעיל גם מהמקלדת. האתר זוכר את הבחירה, וקורא מסך מקריא את היעדים כטקסט רגיל.</li>
            <li>האתר כתוב בעברית מימין לשמאל, ושפת העמוד מוגדרת בהתאם.</li>
          </ul>
        </Section>

        <Section title="מה עוד לא הונגש">
          <ul className="list-disc pr-5 space-y-1">
            <li>האתר עוד לא נבדק עם משתמשים בקוראי מסך (NVDA או VoiceOver).</li>
            <li>קישורים חיצוניים (WhatsApp, מפות Google) מובילים לשירותים של צד שלישי, ואין לנו שליטה על הנגישות שלהם.</li>
          </ul>
        </Section>

        <Section title="נגישות הנסיעה עצמה">
          <p>
            אם אתם צריכים התאמה בנסיעה, למשל עזרה בעלייה לאוטובוס, ליווי או מקום לכיסא גלגלים, פנו לאבי מראש ונבדוק
            יחד מה אפשר לעשות.
          </p>
        </Section>

        <Section title="רכז הנגישות">
          <p>
            נתקלתם בבעיית נגישות באתר או בשירות? נשמח לשמוע ולתקן.
          </p>
          <ul className="space-y-1">
            <li>שם: {ACCESSIBILITY_COORDINATOR ? ACCESSIBILITY_COORDINATOR : <Todo>שם רכז הנגישות</Todo>}</li>
            <li>טלפון: {phoneLink} (שיחה או וואטסאפ)</li>
            <li>מייל: {emailLink}</li>
          </ul>
        </Section>
      </div>
    </LegalDialog>
  );
}
