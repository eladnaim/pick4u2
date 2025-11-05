# צוות סוכנים לפרויקט Pick4U

מסמך זה מגדיר סוכנים וירטואליים שיפעלו במקביל, את תחומי האחריות שלהם, קבצים רלוונטיים, קריטריונים לקבלה (DoD) ושיטת עבודה.

## עקרונות עבודה מקבילית
- כל סוכן אחראי על תחום ברור עם קבצים משויכים.
- משימות נפתחות כ־Issue לפי תבנית מתאימה ומסומנות לתחום הסוכן.
- חיבור ל־Git: ענף `main`, פיצולים לפי פיצ'ר, PR עם בדיקות ו־lint.
- DoD: קוד בנוי, בדיקות קריטיות, תעוד מינימלי, ללא שגיאות קונסול או נגישות מהותיות.

## סוכנים ותפקידים

### 1) Frontend UI
- אחריות: רכיבי UI, ניווט, נגישות, Tailwind, התאמות `shadcn-ui`.
- קבצים עיקריים: `shadcn-ui/src/components/**`, `shadcn-ui/src/pages/**`, `shadcn-ui/index.html`, `shadcn-ui/src/App.tsx`.
- DoD: רכיב/מסך פועל, נגישות בסיסית, ללא אזהרות TypeScript.

### 2) Mobile/PWA
- אחריות: `manifest.json`, אייקונים/ספלאש, התקנה כאפליקציה, Lighthouse.
- קבצים: `shadcn-ui/public/manifest.json`, `shadcn-ui/public/sw.js`, `shadcn-ui/public/icons/**`, `shadcn-ui/public/splash/**`.
- DoD: התקנה PWA תקינה, נכסי אייקונים תקינים, ציון Lighthouse ≥ 90 על PWA.

### 3) Notifications
- אחריות: Firebase Messaging, הרשאות, ניהול נוטיפיקציות.
- קבצים: `shadcn-ui/public/firebase-messaging-sw.js`, `shadcn-ui/src/services/notificationService.ts`, `shadcn-ui/src/services/pushNotifications.ts`.
- DoD: הרשאה ניתנת, קבלת הודעות foreground/background, תיעוד הפעלה.

### 4) Maps/Location
- אחריות: שילוב Google Maps, שירותי מיקום, תצוגות מפה/מסלולים.
- קבצים: `shadcn-ui/src/services/locationService.ts`, שימוש ב־`@googlemaps/js-api-loader` בקומפוננטות.
- DoD: מפת בסיס מוצגת, קבלת מיקום משתמש, טיפול בשגיאות הרשאות.

### 5) Authentication
- אחריות: זרימת כניסה/הרשמה, ניהול מצב משתמש, OTP אם נדרש.
- קבצים: `shadcn-ui/src/hooks/useAuth.ts`, `shadcn-ui/src/services/authService.ts`, UI טפסים.
- DoD: כניסה/יציאה פעילה, מצב משתמש זמין בקומפוננטות, טעויות מוצגות למשתמש.

### 6) Data/API
- אחריות: חיבור ל־Backend/Firebase, קריאות נתונים, טיפול בשגיאות.
- קבצים: `shadcn-ui/src/config/firebase.ts`, `shadcn-ui/src/services/**`, `shadcn-ui/src/types/**`.
- DoD: קריאה/כתיבה תקינה, טיפוסי Zod או TS, טיפול שגיאות עקבי.

### 7) QA
- אחריות: בדיקות ידניות לזרימות קריטיות, תקלות UI, רספונסיביות.
- קבצים: אין ייעודיים; מתעד ב־Issues ו־PR checklist.
- DoD: כיסוי תרחישים עיקריים, רשימת באגים מתוקפת.

### 8) DevOps
- אחריות: חיבור Git, CI/CD (Vercel/Netlify), ניהול `.env`.
- קבצים: `shadcn-ui/vercel.json`, `shadcn-ui/netlify.toml`, `.env.example`, קונפיגי build.
- DoD: בניה והפצה אוטומטית, מסמכי פריסה מעודכנים.

## זרימת עבודה מומלצת
1. יצירת Issue לפי תבנית הסוכן.
2. פתיחת ענף `feature/<agent>/<short-name>`.
3. פיתוח + `npm run dev` לבדיקות.
4. בדיקות/לינטים: `npm run lint`, `npm run build`.
5. פתיחת PR עם קישור ל־Issue ו־DoD מסומן.

## קישורים עוזרים
- `shadcn-ui/README.md`, `DEPLOYMENT.md`, `GITHUB_SETUP.md`, `UPDATE_INSTRUCTIONS.md`.
- אפיון: `uploads/פורמט אפיון אפליקציה מקיף.docx` (לחלץ דרישות למשימות הסוכנים).