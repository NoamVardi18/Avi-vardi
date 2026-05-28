# מדריך פריסה ל-Vercel — אבי ורדי הסעות

## דרישות מוקדמות

לפני הפריסה ל-Vercel יש לוודא שהפריטים הבאים מוכנים:

- חשבון [Vercel](https://vercel.com) מחובר ל-GitHub

- ה-repository `NoamVardi18/Avi-vardi` מועלה ומעודכן ב-GitHub

- גישה לכל משתני הסביבה המפורטים למטה

---

## שלבי הפריסה

### שלב 1 — ייבוא הפרויקט ל-Vercel

1. היכנסו ל-[vercel.com/new](https://vercel.com/new)

1. בחרו **Import Git Repository**

1. בחרו את ה-repo: `NoamVardi18/Avi-vardi`

1. **Framework Preset** — בחרו **Other**

1. **Root Directory** — השאירו ריק (הפרויקט בשורש)

1. **Build Command** — `pnpm build`

1. **Output Directory** — `dist` (הקובץ `dist/index.js` הוא שרת ה-Express שמגיש גם את ה-API וגם את הפרונטאנד מ-`dist/public`)

1. **Install Command** — `pnpm install`

### שלב 2 — הגדרת משתני סביבה

תחת **Environment Variables** הוסיפו את כל המשתנים הבאים:

| משתנה | ערך | הערה |
| --- | --- | --- |
| `DATABASE_URL` | `mysql://...` | מחרוזת חיבור ל-TiDB/MySQL |
| `JWT_SECRET` | ערך ארוך ואקראי | לחתימת cookies |
| `VITE_APP_ID` | מ-Manus Dashboard | OAuth App ID |
| `OAUTH_SERVER_URL` | `https://oauth.manus.im` |  |
| `VITE_OAUTH_PORTAL_URL` | `https://portal.manus.im` |  |
| `OWNER_OPEN_ID` | מ-Manus Dashboard |  |
| `OWNER_NAME` | `אבי ורדי` |  |
| `BUILT_IN_FORGE_API_URL` | מ-Manus Dashboard |  |
| `BUILT_IN_FORGE_API_KEY` | מ-Manus Dashboard | Server-side only |
| `VITE_FRONTEND_FORGE_API_KEY` | מ-Manus Dashboard | Frontend |
| `VITE_FRONTEND_FORGE_API_URL` | מ-Manus Dashboard | Frontend |
| `VITE_APP_TITLE` | `אבי ורדי הסעות` |  |
| `SUPABASE_URL` | `https://nlwkksivgubcgfzqivcs.supabase.co` |  |
| `SUPABASE_ANON_KEY` | ראו `server/supabase.ts` |  |

### שלב 3 — פריסה

לחצו **Deploy**. Vercel יריץ `pnpm install && pnpm build` ויפרוס את האתר.

---

## הגדרת דומיין מותאם אישית

לאחר הפריסה הראשונה:

1. לכו ל-**Settings → Domains** בפרויקט Vercel

1. הוסיפו את הדומיין שלכם (לדוגמה `avivardi.co.il` )

1. עדכנו את רשומות ה-DNS אצל ספק הדומיין שלכם:
  - `A` record → `76.76.21.21`
  - או `CNAME` → `cname.vercel-dns.com`

---

## עדכונים עתידיים

כל `git push` ל-branch `main` יפעיל פריסה אוטומטית ב-Vercel.

---

## פתרון בעיות נפוצות

| בעיה | פתרון |
| --- | --- |
| שגיאת build | בדקו שכל משתני הסביבה הוגדרו |
| API לא עובד | ודאו שה-`vercel.json` קיים בשורש |
| מסד נתונים לא מתחבר | בדקו את `DATABASE_URL` ושה-IP של Vercel מורשה ב-TiDB |
| OAuth לא עובד | ודאו שה-callback URL הוגדר ב-Manus Dashboard לכתובת Vercel |

